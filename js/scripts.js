fetch('https://script.google.com/macros/s/AKfycbyp8jBa0QCCaBNc0GPDYjtlQIejSFulQUJWJ140KP1KefY8rJYbSoc4x060V6X5Fmhekw/exec')
  .then(response => response.json())
  .then(data => {
    const newsContainer = document.getElementById('news');
    data.articles.forEach(article => {
      const articleElement = document.createElement('div');
      articleElement.innerHTML = `
        <h2>${article.title}</h2>
        <p>${article.description}</p>
        <a href="${article.url}" target="_blank">Read more</a>
      `;
      newsContainer.appendChild(articleElement);
    });
  })
  .catch(error => console.error('Error fetching news:', error));
