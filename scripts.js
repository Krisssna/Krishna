document.addEventListener("DOMContentLoaded", function () {
    // Progress Bar Animation
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

    // Menu Toggle
    const menu = document.getElementById("menu");
    const menuIcon = document.querySelector(".menu-icon");

    function toggleMenu() {
        menu.classList.toggle("active");
    }

    if (menuIcon) {
        menuIcon.addEventListener("click", toggleMenu);
    }

    // Smooth Scrolling and Menu Close (Exclude Calculator Link)
    const sections = ["#contact", "#portfolio", "#tools", "#about-work"];
    sections.forEach(selector => {
        document.querySelectorAll(`a[href="${selector}"]:not(#steel-gi-calculator)`).forEach(link => {
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

    // Back to Top Button
    const backToTopButton = document.querySelector(".back-to-top");

    if (backToTopButton) {
        window.addEventListener("scroll", () => {
            backToTopButton.classList.toggle("show", window.scrollY > 300);
        });

        backToTopButton.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Theme Toggle
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

    // Steel & GI Calculator
    const steelGiLink = document.getElementById("steel-gi-calculator");
    const mainContent = document.getElementById("main-content");

    if (steelGiLink) {
        steelGiLink.addEventListener("click", function (event) {
            event.preventDefault(); 
            event.stopPropagation(); 
            console.log("Steel & GI Calculator clicked"); // Debug log

            fetch("steel-bars-calculator/index.html")
                .then(response => {
                    if (!response.ok) throw new Error(`Failed to load calculator HTML: ${response.status}`);
                    return response.text();
                })
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, "text/html");
                    const calculatorMain = doc.querySelector("main").innerHTML;
                    mainContent.innerHTML = calculatorMain;
                    console.log("Calculator content loaded"); // Debug log

                  
                    fetch("https://steel.niraula300.workers.dev/")
                        .then(response => {
                            if (!response.ok) throw new Error("Failed to load calculator script");
                            return response.text();
                        })
                        .then(jsCode => {
                            const existingScript = document.getElementById("calculator-script");
                            if (existingScript) existingScript.remove();

                            const script = document.createElement("script");
                            script.id = "calculator-script";
                            script.text = jsCode;
                            document.body.appendChild(script);
                            console.log("Calculator script loaded"); 
                        })
                        .catch(error => console.error("Error loading calculator script:", error));
                })
                .catch(error => console.error("Error loading calculator HTML:", error));
        });
    }
});
