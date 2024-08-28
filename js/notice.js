const noticesContainer = document.getElementById('notices-container');

function displayNotices() {
    const notices = [
        {
            title: "Important Announcement",
            content: "This is a sample notice."
        },
        // Add more notices here
    ];

    noticesContainer.innerHTML = ''; // Clear previous notices

    notices.forEach(notice => {
        const noticeDiv = document.createElement('div');
        noticeDiv.className = 'notice-card';
        noticeDiv.innerHTML = `
            <h3>${notice.title}</h3>
            <p>${notice.content}</p>
        `;
        noticesContainer.appendChild(noticeDiv);
    });
}

document.querySelector('nav ul li a[href="#notices"]').addEventListener('click', function() {
    displayNotices();
});
