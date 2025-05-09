document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (toggle && navMenu) {
        toggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            // Toggle between hamburger (☰) and close (✖) icon
            toggle.textContent = navMenu.classList.contains('open') ? '✖' : '☰';
        });
    } else {
        console.error("Menu toggle button or menu not found in DOM.");
    }
});
