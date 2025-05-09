document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
  
    toggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  });
  