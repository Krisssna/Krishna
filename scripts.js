document.addEventListener("DOMContentLoaded", function () {
    const progressBars = document.querySelectorAll(".progress-bar");

    function animateProgressBars() {
        progressBars.forEach(bar => {
            let value = bar.getAttribute("aria-valuenow");
            bar.style.width = value + "%";
        });
    }

    const skillsSection = document.querySelector("#skills");
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            animateProgressBars();
            observer.unobserve(skillsSection);
        }
    }, { threshold: 0.5 });

    if (skillsSection) {
        observer.observe(skillsSection);
    }

    // Toggle Mobile Menu
    function toggleMenu() {
        const menu = document.getElementById("menu");
        menu.classList.toggle("active"); // Change 'open' to 'active' to match CSS
    }

    document.querySelector(".menu-icon").addEventListener("click", toggleMenu);

    // Handle Dropdown Menus in Mobile View
    document.querySelectorAll(".dropdown").forEach(item => {
        item.addEventListener("click", function (event) {
            if (window.innerWidth <= 768) { // Only for mobile view
                event.stopPropagation(); // Prevents immediate closing
                this.classList.toggle("open-dropdown"); // Toggle class
            }
        });
    });

    // Smooth Scroll for Contact Links
    document.querySelectorAll('a[href="#contact"]').forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            document.querySelector("footer").scrollIntoView({ behavior: "smooth" });

            // Close the menu after clicking in mobile view
            const menu = document.getElementById("menu");
            if (menu.classList.contains("active")) {
                menu.classList.remove("active");
            }
        });
    });
});