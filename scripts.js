const body = document.querySelector('body');
const sidebar = document.querySelector('.sidebar');
const toggle = document.querySelector('.toggle');
const search = document.querySelector('.search-box');
const modeSwitch = document.querySelector('.toggle-switch');
const modeText = document.querySelector('.mode-text');
const navLinks = document.querySelectorAll('.nav-links');

// Initialize theme from localStorage so user's choice persists across pages
function initTheme() {
    try {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') {
            body.classList.add('dark');
            if (modeText) modeText.innerText = 'Dark mode';
        } else {
            body.classList.remove('dark');
            if (modeText) modeText.innerText = 'Light mode';
        }
    } catch (e) {
        // localStorage may be unavailable in some contexts; ignore silently
    }
}


// sidebar toggle (guard elements in case script runs on pages without sidebar)
if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('close');
    });
}

// when clicked calling the mode change
if (modeSwitch) {
    modeSwitch.addEventListener('click', () => {
        modeChange();
    });
}


//  mode change function
function modeChange() {
    body.classList.toggle('dark');
    if (body.classList.contains('dark')) {
        if (modeText) modeText.innerText = 'Dark mode';
        try { localStorage.setItem('theme', 'dark'); } catch (e) {}
    } else {
        if (modeText) modeText.innerText = 'Light mode';
        try { localStorage.setItem('theme', 'light'); } catch (e) {}
    }
}

// Add active class to the clicked link and remove from others
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Remove 'active' class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        // Add 'active' class to the clicked link
        link.classList.add('active');
    });
});

// Set active nav item based on current URL (runs on load)
function initActiveNav() {
    try {
        const anchors = document.querySelectorAll('.menu-links a');
        const currentPage = window.location.pathname.split('/').pop() || '';
        anchors.forEach(a => {
            const href = a.getAttribute('href') || '';
            // Resolve relative href to a pathname
            const resolved = new URL(href, window.location.href).pathname.split('/').pop() || '';
            const parent = a.closest('.nav-links');
            if (!parent) return;
            if (resolved === currentPage || (resolved === 'index.html' && (currentPage === '' || currentPage === 'index.html'))) {
                parent.classList.add('active');
            } else {
                parent.classList.remove('active');
            }
        });
    } catch (e) {
        // ignore failures (e.g., in odd URL environments)
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initActiveNav);
} else {
    initActiveNav();
}



// when screen loaded calling the mode change
let loadedr = 0;
// initialize theme as early as possible
initTheme();

// Project Gallery Filter
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length && galleryItems.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 0);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleryFilter);
} else {
    initGalleryFilter();
}

// Contact form behavior on about page
function initContactForm() {
    const profileCard = document.getElementById('profileCard');
    const contactBtn = document.getElementById('contactBtn');
    const contactForm = document.getElementById('contactForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const sendBtn = document.getElementById('sendBtn');
    const contactNotice = document.getElementById('contactNotice');

    if (!profileCard || !contactBtn || !contactForm) return;

    // Helper to set aria-hidden and inert (with a fallback) and manage focusable children
    function setHiddenAndInert(el, hidden) {
        el.setAttribute('aria-hidden', hidden ? 'true' : 'false');
        // Prefer native inert when available
        if ('inert' in el) {
            el.inert = hidden;
        } else {
            // Fallback: disable and remove tab stops from focusable elements inside
            const focusableSelector = 'a[href], button, input, textarea, select, [tabindex]';
            const nodes = el.querySelectorAll(focusableSelector);
            nodes.forEach(node => {
                if (hidden) {
                    // store previous state
                    if (node.hasAttribute('tabindex')) node.dataset.prevTab = node.getAttribute('tabindex'); else node.dataset.prevTab = '';
                    node.setAttribute('tabindex', '-1');
                    if ((node.tagName === 'INPUT' || node.tagName === 'TEXTAREA' || node.tagName === 'BUTTON' || node.tagName === 'SELECT') && !node.disabled) {
                        node.dataset.prevDisabled = 'false';
                        node.disabled = true;
                    }
                } else {
                    // restore previous state
                    if (node.dataset.prevTab !== undefined) {
                        if (node.dataset.prevTab === '') node.removeAttribute('tabindex'); else node.setAttribute('tabindex', node.dataset.prevTab);
                        delete node.dataset.prevTab;
                    }
                    if (node.dataset.prevDisabled !== undefined) {
                        if (node.dataset.prevDisabled === 'false') node.disabled = false;
                        delete node.dataset.prevDisabled;
                    }
                }
            });
        }
        // If hiding and focus is inside el, move focus to the contact toggle button
        if (hidden) {
            if (document.activeElement && el.contains(document.activeElement)) {
                contactBtn.focus();
            }
        }
    }

    // Toggle expand and show form (with height animation)
    contactBtn.addEventListener('click', () => {
        const expanded = profileCard.classList.toggle('expanded');

        // If expanding: animate to the content height, then remove inline maxHeight so it can be responsive.
        if (expanded) {
            // ensure aria and inert states are updated so inputs are focusable
            setHiddenAndInert(contactForm, false);

            // measure the full height
            const fullHeight = contactForm.scrollHeight;
            // apply measured height to trigger CSS transition on max-height
            contactForm.style.maxHeight = fullHeight + 'px';
            contactForm.style.opacity = '1';

            // after transition ends, remove max-height to allow the form to size naturally
            const onEnd = (e) => {
                if (e.propertyName === 'max-height') {
                    contactForm.style.maxHeight = 'none';
                    contactForm.removeEventListener('transitionend', onEnd);
                }
            };
            contactForm.addEventListener('transitionend', onEnd);

            // update aria-expanded on the toggle button
            contactBtn.setAttribute('aria-expanded', 'true');

            // focus first input after a short delay (allow animation to start)
            setTimeout(() => {
                const nameInput = document.getElementById('contactName');
                if (nameInput) nameInput.focus();
            }, 260);
        } else {
            // collapsing: set maxHeight to current height then to 0 to animate
            // if maxHeight was 'none', compute scrollHeight first
            if (contactForm.style.maxHeight === 'none' || !contactForm.style.maxHeight) {
                contactForm.style.maxHeight = contactForm.scrollHeight + 'px';
            }
            // force reflow
            // eslint-disable-next-line no-unused-expressions
            contactForm.offsetHeight;
            contactForm.style.maxHeight = '0';
            contactForm.style.opacity = '0';

            // update aria/inert after collapse so focus management is correct
            // wait for animation to complete (match CSS 350ms)
            setTimeout(() => {
                setHiddenAndInert(contactForm, true);
                contactBtn.setAttribute('aria-expanded', 'false');
            }, 360);
        }
    });

    // Cancel button — collapse (animate)
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            profileCard.classList.remove('expanded');

            // animate collapse similar to toggle
            if (contactForm.style.maxHeight === 'none' || !contactForm.style.maxHeight) {
                contactForm.style.maxHeight = contactForm.scrollHeight + 'px';
            }
            // force reflow
            contactForm.offsetHeight;
            contactForm.style.maxHeight = '0';
            contactForm.style.opacity = '0';

            setTimeout(() => {
                setHiddenAndInert(contactForm, true);
                contactNotice.textContent = '';
            }, 360);
        });
    }

    // On submit, show confirmation modal and then open mail client or POST to endpoint if configured
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        if (!name || !email || !message) {
            contactNotice.textContent = 'Please fill all fields.';
            return;
        }

        // show confirmation modal
        const modal = document.getElementById('confirmModal');
        const modalProceed = document.getElementById('modalProceed');
        const modalClose = document.getElementById('modalClose');
        const modalText = document.getElementById('modalText');
        if (!modal || !modalProceed || !modalClose) {
            // fallback to mailto directly
            openMailto(name, email, message);
            return;
        }

        // update modal text to include recipient (already shows default) and show
        modal.setAttribute('aria-hidden', 'false');
        // ensure modal receives focus so elements inside the form are not focused while modal open
        setTimeout(() => {
            if (modal) {
                const focusTarget = modal.querySelector('#modalProceed') || modal.querySelector('.modal-content');
                if (focusTarget && typeof focusTarget.focus === 'function') focusTarget.focus();
            }
        }, 0);

        function cleanupModal() {
            modal.setAttribute('aria-hidden', 'true');
            modalProceed.removeEventListener('click', onProceed);
            modalClose.removeEventListener('click', onClose);
        }

        function onProceed() {
            cleanupModal();
            // If form has data-endpoint attribute, try to POST; otherwise fall back to mailto
            const endpoint = contactForm.getAttribute('data-endpoint');
            if (endpoint) {
                // POST JSON
                fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                }).then(resp => {
                    contactNotice.textContent = 'Message submitted. Thank you!';
                }).catch(err => {
                    // If the POST fails, fallback to mailto
                    contactNotice.textContent = 'Failed to submit to server, opening email client instead.';
                    openMailto(name, email, message);
                }).finally(() => {
                    profileCard.classList.remove('expanded');
                    contactForm.setAttribute('aria-hidden', 'true');
                });
            } else {
                openMailto(name, email, message);
                contactNotice.textContent = 'Opening your email client...';
                profileCard.classList.remove('expanded');
                contactForm.setAttribute('aria-hidden', 'true');
            }
        }

        function onClose() { cleanupModal(); }

        function openMailto(name, email, message) {
            const to = 'manids1801@gmail.com';
            const subject = encodeURIComponent(`Contact from ${name} — Portfolio site`);
            const bodyLines = [];
            bodyLines.push(`Name: ${name}`);
            bodyLines.push(`Email: ${email}`);
            bodyLines.push('');
            bodyLines.push(message);
            const body = encodeURIComponent(bodyLines.join('\n'));
            const mailto = `mailto:${to}?subject=${subject}&body=${body}`;
            window.location.href = mailto;
        }

        modalProceed.addEventListener('click', onProceed);
        modalClose.addEventListener('click', onClose);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
} else {
    initContactForm();
}