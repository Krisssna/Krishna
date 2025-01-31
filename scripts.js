function toggleMenu() {
    const menu = document.getElementById('menu');
    if (menu) {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }
}

document.addEventListener('click', function(event) {
    const menu = document.getElementById('menu');
    const menuIcon = document.querySelector('.menu-icon');

    if (menu && !menu.contains(event.target) && !menuIcon.contains(event.target)) {
        menu.style.display = 'none';
    }
});

document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', function(event) {
        event.stopPropagation();
        const content = this.querySelector('.dropdown-content');
        if (content) {
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Initialize progress bars
    const progressBars = document.querySelectorAll(".progress-bar");
    progressBars.forEach((bar) => {
        const value = bar.getAttribute("aria-valuenow");
        bar.style.width = value + "%";
    });

    // Scroll to contact section smoothly
    const contactLink = document.querySelector('nav a[href="#contact"]');
    if (contactLink) {
        contactLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.getElementById('contact-email');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Back to top button functionality
    const backToTop = document.getElementById("backToTop");
    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (document.documentElement.scrollTop > 200) {
                backToTop.style.display = "block";
            } else {
                backToTop.style.display = "none";
            }
        });

        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    const popup = document.getElementById('areaCalculatorPopup');
    const areaCalculatorBtn = document.getElementById('areaCalculatorBtn');
    const closeBtn = popup.querySelector('.close');
    const iframe = document.getElementById('areaCalculatorIframe');
    let lastResult = ''; // Store last result

    areaCalculatorBtn.addEventListener('click', function() {
        popup.style.display = "block";
        iframe.contentWindow.document.getElementById('results').innerText = lastResult; // Update with last result
    });

    closeBtn.addEventListener('click', function() {
        popup.style.display = "none";
    });

    // When clicking outside of the popup, minimize it
    window.addEventListener('click', function(event) {
        if (event.target == popup) {
            popup.style.display = "none";
        }
    });

    // Function to get last result from iframe (if needed for other interactions)
    function getLastResult() {
        return iframe.contentWindow.lastResult;
    }
});
