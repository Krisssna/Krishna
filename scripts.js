document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded");

    
    const progressBars = document.querySelectorAll(".progress-bar");
    const skillsSection = document.querySelector("#skills");
    console.log("Skills section found:", skillsSection);
    console.log("Progress bars found:", progressBars.length);

    function animateProgressBars() {
        progressBars.forEach(bar => {
            const value = bar.getAttribute("aria-valuenow");
            bar.style.width = `${value}%`;
            console.log(`Animating bar to ${value}%`);
        });
    }

    if (skillsSection) {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                console.log("Skills section in view");
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
    console.log("Theme toggle found:", themeToggle);

    if (localStorage.getItem("theme") === "night") {
        body.classList.add("night-mode");
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            console.log("Theme toggle clicked");
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
});

if (steelGiLink) {
    steelGiLink.addEventListener("click", function (event) {
        event.preventDefault();
        fetch("steel-bars-calculator/")
            .then(response => {
                if (!response.ok) throw new Error("Failed to load calculator HTML");
                return response.text();
            })
            .then(html => {
                mainContent.innerHTML = html;
                fetch("https://steel.niraula300.workers.dev/")
                    .then(response => response.text())
                    .then(jsCode => {
                        const script = document.createElement("script");
                        script.text = jsCode;
                        document.body.appendChild(script);
                    })
                    .catch(error => console.error("Error loading calculator script:", error));
            })
            .catch(error => console.error("Error loading calculator HTML:", error));
    });
}


