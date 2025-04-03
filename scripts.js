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


    const backToTopButton = document.querySelector(".back-to-top");

    if (backToTopButton) {
        window.addEventListener("scroll", () => {
            backToTopButton.classList.toggle("show", window.scrollY > 300);
        });

        backToTopButton.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
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


    const steelGiLink = document.getElementById("steel-gi-calculator");
    const mainContent = document.getElementById("main-content");
    console.log("mainContent:", mainContent);

    if (steelGiLink) {
        steelGiLink.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            console.log("Steel & GI Calculator clicked");

            if (!mainContent) {
                console.error("mainContent is null - check HTML for id='main-content'");
                return;
            }

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
                    console.log("Calculator content loaded");

                 
                    fetch("steel-bars-calculator/styles.css")
                        .then(response => {
                            if (!response.ok) throw new Error(`Failed to load calculator CSS: ${response.status}`);
                            return response.text();
                        })
                        .then(css => {
                            const existingStyle = document.getElementById("calculator-style");
                            if (existingStyle) existingStyle.remove();

                            const style = document.createElement("style");
                            style.id = "calculator-style";
                            style.textContent = css;
                            document.head.appendChild(style);
                            console.log("Calculator CSS loaded");
                        })
                        .catch(error => console.error("Error loading calculator CSS:", error));

                 
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
