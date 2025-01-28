function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', function(event) {
    const menu = document.getElementById('menu');
    const menuIcon = document.querySelector('.menu-icon');
    if (!menu.contains(event.target) && !menuIcon.contains(event.target)) {
        menu.style.display = 'none';
    }
});

document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', function(event) {
        event.stopPropagation();
        const content = this.querySelector('.dropdown-content');
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const progressBars = document.querySelectorAll(".progress-bar");

    progressBars.forEach((bar) => {
        const value = bar.getAttribute("aria-valuenow");
        bar.style.width = value + "%"; // Set the width based on aria-valuenow
    });
});


document.addEventListener('DOMContentLoaded', function() {
    // Find the menu contact link
    var contactLink = document.querySelector('nav a[href="#contact"]');
    
    if (contactLink) {
        contactLink.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the default action of the link if it's a hash link
            
            // Get the element you want to scroll to
            var target = document.getElementById('contact-email');
            
            if (target) {
                // Scroll to the target
                target.scrollIntoView({
                    behavior: 'smooth', // Smooth scrolling
                    block: 'start' // Align with the top of the viewport
                });
            }
        });
    }
});
