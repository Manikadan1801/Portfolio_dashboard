const body = document.querySelector('body');
const sidebar = document.querySelector('.sidebar');
const toggle = document.querySelector('.toggle');
const search = document.querySelector('.search-box');
const modeSwitch = document.querySelector('.toggle-switch');
const modeText = document.querySelector('.mode-text');
const navLinks = document.querySelectorAll('.nav-links');

toggle.addEventListener('click', () => {
    sidebar.classList.toggle('close');
});

modeSwitch.addEventListener('click', () => {
  body.classList.toggle('dark');
  if (body.classList.contains('dark')) {
      modeText.innerText = 'Dark mode';
      
  } else {
      modeText.innerText = 'Light mode';
  }
});

navLinks.forEach(link => {
    console.log(link);
    link.addEventListener('click', () => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});