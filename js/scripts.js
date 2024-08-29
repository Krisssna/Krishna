document.addEventListener("DOMContentLoaded", function () {
    const newsLink = document.querySelector('nav ul li a[href="#news"]');

    // Use your Google Apps Script URL here
    const proxyUrl = https://script.google.com/macros/s/AKfycbzBomLGMYJNeh2hmt2_y0mStt9NptXUHdDW5mLu3bEa3O75TPQNUzLlsVo6nEMGPPtoTw/exec;

    newsLink.addEventListener('click', function (event) {
        event.preventDefault();

        fetch(proxyUrl)
            .then(response => response.text())
            .then(data => {
                // Inject the filtered news content into a news section
                document.getElementById('news').innerHTML = data;
            })
            .catch(error => console.error('Error fetching the news:', error));
    });
});
