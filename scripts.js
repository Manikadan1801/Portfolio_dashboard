const body = document.querySelector('body');
const sidebar = document.querySelector('.sidebar');
const toggle = document.querySelector('.toggle');
const search = document.querySelector('.search-box');
const modeSwitch = document.querySelector('.toggle-switch');
const modeText = document.querySelector('.mode-text');
const navLinks = document.querySelectorAll('.nav-links');


// sidebar toggle
toggle.addEventListener('click', () => {
    sidebar.classList.toggle('close');
});

// when clicked calling the mode change
modeSwitch.addEventListener('click', () => {
 modeChange();
});


//  mode change function
 function modeChange() {
    body.classList.toggle('dark');
  if (body.classList.contains('dark')) {
      modeText.innerText = 'Dark mode';
      
  } else {
      modeText.innerText = 'Light mode';
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



// when screen loaded calling the mode change
let loadedr = 0;
window.addEventListener('load', () => {
   
});