let currentType = '';

function handleBituminousSelection(type) {
    currentType = type;
    document.getElementById('input-form').classList.remove('hidden');
    document.getElementById('type-title').textContent = type;
    document.getElementById('type-description').textContent = `Specifications for ${type}`;

    const moreButton = document.getElementById('more-button');
    moreButton.classList.remove('hidden');
    moreButton.textContent = `More about ${type}`;
}

function openMorePopup() {
    if (!currentType) return;

    const popup = document.getElementById('more-popup');
    const iframe = document.getElementById('popup-iframe');

    const typeToFileMap = {
        'BM-19mm': 'bm.html',
        'BM-40mm': 'bm.html',
        'DBM-26.5mm': 'dbm.html',
        'DBM-35.5mm': 'dbm.html',
        'BC-13.2mm': 'bc.html',
        'BC-19mm': 'bc.html',
        'PMC-Close': 'pmcc.html',
        'PMC-Open': 'pmc.html',
        'SandSeal': 'sandasphalt.html'
    };

    const htmlFile = typeToFileMap[currentType] || 'default.html';
    iframe.src = htmlFile;
    popup.classList.remove('hidden');
}

function closeMorePopup() {
    document.getElementById('more-popup').classList.add('hidden');
    document.getElementById('popup-iframe').src = ''; 
}
