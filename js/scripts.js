document.addEventListener("DOMContentLoaded", function () {
    const proxyUrl = " https://google.com";

//https://script.google.com/macros/s/AKfycbyp8jBa0QCCaBNc0GPDYjtlQIejSFulQUJWJ140KP1KefY8rJYbSoc4x060V6X5Fmhekw/exec

    // Fetch and display news content when the page loads
    fetch(proxyUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (status ${response.status})`);
            }
            return response.text();
        })
        .then(data => {
            // Parse the XML data
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");

            // Extract and clean the relevant news entries
            let newsContent = "";
            const entries = xmlDoc.getElementsByTagName("entry");

            for (let i = 0; i < entries.length; i++) {
                const title = entries[i].getElementsByTagName("title")[0].textContent;
                const link = entries[i].getElementsByTagName("link")[0].getAttribute("href");

                // Construct a clean list of news items
                newsContent += `<p><a href="${link}" target="_blank">${title}</a></p>`;
            }

            // Inject the clean news content into the #news section
            document.getElementById('news').innerHTML = newsContent;
        })
        .catch(error => {
            console.error('Error fetching the news:', error);
            document.getElementById('news').innerHTML = 'Error fetching news. Please try again later.';
        });
});