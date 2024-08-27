/*!
* Start Bootstrap - Freelancer v7.0.3 (https://startbootstrap.com/theme/freelancer)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 72,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // News fetching and display functionality
    const newsContainer = document.getElementById('news-container');
    
    function fetchNews(url) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "text/xml");
                const items = xmlDoc.getElementsByTagName('item');
                
                newsContainer.innerHTML = ''; // Clear previous news

                for (let i = 0; i < items.length; i++) {
                    const title = items[i].getElementsByTagName('title')[0].textContent;
                    const description = items[i].getElementsByTagName('description')[0].textContent;

                    // Exclude certain words in Nepali
                    const excludedWords = ['महोत्सब', 'उत्सव', 'प्रतियोगिता', 'प्रदर्शनी'];
                    if (!excludedWords.some(word => title.includes(word) || description.includes(word))) {
                        const card = document.createElement('div');
                        card.className = 'news-card';
                        card.innerHTML = `
                            <h3>${title}</h3>
                            <p>${description.substring(0, 500)}</p>
                        `;
                        newsContainer.appendChild(card);
                    }
                }
            })
            .catch(error => console.error('Error fetching news:', error));
    }

    document.querySelector('nav ul li a[href="#news"]').addEventListener('click', function() {
        fetchNews('https://www.google.com/alerts/feeds/17248606588752154671/17646417480729972491');
        fetchNews('https://www.google.com/alerts/feeds/06313983183609550648/13722836873792678019');
        fetchNews('https://www.google.com/alerts/feeds/17248606588752154671/15089319890734284885');
        fetchNews('https://www.google.com/alerts/feeds/06313983183609550648/16120492411931428893');
    });
});
