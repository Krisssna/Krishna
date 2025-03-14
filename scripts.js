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

    observer.observe(skillsSection);


    function toggleMenu() {
        const menu = document.getElementById("menu");
        menu.classList.toggle("open");
    }

    document.querySelector(".menu-icon").addEventListener("click", toggleMenu);

 
    document.querySelectorAll('a[href="#contact"]').forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            document.querySelector("footer").scrollIntoView({ behavior: "smooth" });
        });
    });
});
