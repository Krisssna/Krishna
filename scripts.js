document.addEventListener("DOMContentLoaded", function () {
    const progressBars = document.querySelectorAll(".progress-bar");
    const skillsSection = document.querySelector("#skills");

    function animateProgressBars() {
        progressBars.forEach(bar => {
            const value = bar.getAttribute("aria-valuenow");
            bar.style.width = `${value}%`;
        });
    }

    if (skillsSection) {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                animateProgressBars();
                observer.unobserve(skillsSection);
            }
        }, { threshold: 0.5 });
        observer.observe(skillsSection);
    }


    const menu = document.getElementById("menu");
    const menuIcon = document.querySelector(".menu-icon");

    function toggleMenu() {
        menu.classList.toggle("active");
    }

    if (menuIcon) {
        menuIcon.addEventListener("click", toggleMenu);
    }


    const sections = ["#contact", "#portfolio", "#tools", "#about-work"];
    sections.forEach(selector => {
        document.querySelectorAll(`a[href="${selector}"]`).forEach(link => {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                const target = selector === "#contact" ? "footer" : selector;
                document.querySelector(target).scrollIntoView({ behavior: "smooth" });
                if (menu.classList.contains("active")) {
                    menu.classList.remove("active");
                }
            });
        });
    });


    const backToTopButton = document.querySelector(".back-to-top");

    if (backToTopButton) {
        window.addEventListener("scroll", () => {
            backToTopButton.classList.toggle("show", window.scrollY > 300);
        });

        backToTopButton.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    } else {
        console.error("Back to Top button not found in the DOM");
    }

 
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    if (localStorage.getItem("theme") === "night") {
        body.classList.add("night-mode");
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            body.classList.toggle("night-mode");
            if (body.classList.contains("night-mode")) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem("theme", "night");
            } else {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem("theme", "day");
            }
        });
    }
