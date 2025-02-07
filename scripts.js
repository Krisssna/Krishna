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

    // Area Calculator Setup
    const areaCalculatorPopup = document.getElementById('areaCalculatorPopup');
    const areaCalculatorBtn = document.getElementById('areaCalculatorBtn');
    const areaCloseBtn = areaCalculatorPopup.querySelector('.close');
    const areaIframe = document.getElementById('areaCalculatorIframe');
    let lastResultForArea = ''; // Store last result for Area Calculator

    areaCalculatorBtn.addEventListener('click', function() {
        areaCalculatorPopup.style.display = "block";
        areaIframe.contentWindow.document.getElementById('results').innerText = lastResultForArea; // Update with last result
    });

    areaCloseBtn.addEventListener('click', function() {
        areaCalculatorPopup.style.display = "none";
    });

    // Date Converter Setup
    const dateConverterPopup = document.getElementById('dateConverterPopup');
    const dateConverterBtn = document.getElementById('dateConverterBtn');
    const dateCloseBtn = dateConverterPopup.querySelector('.close');
    const dateIframe = document.getElementById('dateConverterIframe');

    dateConverterBtn.addEventListener('click', function() {
        dateIframe.src = "https://www.hamropatro.com/widgets/dateconverter.php";
        dateConverterPopup.style.display = "block";
    });

    dateCloseBtn.addEventListener('click', function() {
        dateConverterPopup.style.display = "none";
        dateIframe.src = "about:blank"; // Reset iframe source on close
    });

    // Common functionality for closing popups
    window.addEventListener('click', function(event) {
        if (event.target == areaCalculatorPopup) {
            areaCalculatorPopup.style.display = "none";
        } else if (event.target == dateConverterPopup) {
            dateConverterPopup.style.display = "none";
            dateIframe.src = "about:blank"; // Reset iframe source on close
        }
    });

     const nepaliCalendarPopup = document.getElementById('nepaliCalendarPopup');
    const nepaliCalendarBtn = document.getElementById('nepaliCalendarBtn');
    const nepaliCloseBtn = nepaliCalendarPopup.querySelector('.close');
    const nepaliCalendarIframe = document.getElementById('nepaliCalendarIframe');

    nepaliCalendarBtn.addEventListener('click', function() {
        nepaliCalendarIframe.src = "https://www.hamropatro.com/widgets/calender-full.php";
        nepaliCalendarPopup.style.display = "block";
    });

    nepaliCloseBtn.addEventListener('click', function() {
        nepaliCalendarPopup.style.display = "none";
        nepaliCalendarIframe.src = "about:blank"; // Reset iframe source on close
    });

    // Update the common popup close functionality to include the new Nepali Calendar popup
    window.addEventListener('click', function(event) {
        if (event.target == areaCalculatorPopup) {
            areaCalculatorPopup.style.display = "none";
        } else if (event.target == dateConverterPopup) {
            dateConverterPopup.style.display = "none";
            dateIframe.src = "about:blank";
        } else if (event.target == nepaliCalendarPopup) {
            nepaliCalendarPopup.style.display = "none";
            nepaliCalendarIframe.src = "about:blank";
        }
    });


    // Function to get last result from area calculator iframe (if needed for other interactions)
    function getLastResultForArea() {
        return areaIframe.contentWindow.lastResult;
    }
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/ss.js').then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
    }).catch(function(error) {
        console.log('Service Worker registration failed:', error);
    });
}



    function loadPage(pageUrl) {
        document.body.classList.add('hide-content');
        const iframe = document.getElementById("contentFrame");
        iframe.src = pageUrl;
        iframe.style.display = "block";
    }

function resetPage() {
    document.body.classList.remove('hide-content');
    const iframe = document.getElementById('contentFrame');
    iframe.style.display = 'none';
    iframe.src = '';
}

document.getElementById('backToTop').addEventListener('click', resetPage);
