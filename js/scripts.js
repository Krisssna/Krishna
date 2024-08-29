document.addEventListener("DOMContentLoaded", function () {
    const newsLink = document.querySelector('nav ul li a[href="news"]');
    const proxyUrl = "https://script.google.com/macros/s/AKfycbzy6mqElWH4GOFQARZ92RNwb5tG69vQKtT0z-_FEwI9sbObTfS8GCXZpMoOJFi-O6V00A/exec";

    newsLink.addEventListener('click', function (event) {
        event.preventDefault();

        fetch(proxyUrl)
            .then(response => response.text())
            .then(data => {
                document.getElementById('news').innerHTML = data;
            })
            .catch(error => console.error('Error fetching the news:', error));
    });
});
