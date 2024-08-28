document.addEventListener("DOMContentLoaded", function () {
    const newsLink = document.querySelector('nav ul li a[href="#news"]');
    const noticesLink = document.querySelector('nav ul li a[href="#notices"]');

    const newsSection = document.getElementById('news');
    const noticesSection = document.getElementById('notices');

    // Function to display the news section
    newsLink.addEventListener('click', function (event) {
        event.preventDefault();
        newsSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Function to display the notices section
    noticesLink.addEventListener('click', function (event) {
        event.preventDefault();
        noticesSection.scrollIntoView({ behavior: 'smooth' });
    });
});
