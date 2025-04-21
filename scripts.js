document.addEventListener("DOMContentLoaded", function () {
    const skillsSection = document.querySelector('.skills-section');
    const progressFills = document.querySelectorAll('.progress-fill');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressFills.forEach(bar => {
                    const targetWidth = bar.className.match(/fill-\d+/)[0].split('-')[1] + '%';
                    bar.style.width = targetWidth;
                });
            }
        });
    }, {
        threshold: 0.3 
    });

    observer.observe(skillsSection);

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

    if (steelGiLink) {
        steelGiLink.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (!mainContent) {
                return;
            }

            fetch("steel-bars-calculator/index.html")
                .then(response => {
                    if (!response.ok) throw new Error(`Failed to load calculator HTML: ${response.status}`);
                    return response.text();
                })
                .then(html => {
                    mainContent.innerHTML = html;
                   
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
                        })
                        .catch(error => {});

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
                        })
                        .catch(error => {});
                })
                .catch(error => {});
        });
    }

   
    const sitemapButton = document.getElementById("sitemap-button");
    const sitemapPopup = document.getElementById("sitemap-popup");

    if (sitemapButton && sitemapPopup) {
        sitemapButton.addEventListener("click", () => {
            const isOpen = sitemapPopup.classList.toggle("active");
            sitemapPopup.style.display = isOpen ? "flex" : "none";
        });

        sitemapPopup.addEventListener("click", (e) => {
            if (e.target === sitemapPopup) {
                sitemapPopup.classList.remove("active");
                sitemapPopup.style.display = "none";
            }
        });

        const sitemapLinks = sitemapPopup.querySelectorAll("a");
        sitemapLinks.forEach(link => {
            link.addEventListener("click", () => {
                sitemapPopup.classList.remove("active");
                sitemapPopup.style.display = "none";
            });
        });
    }
});