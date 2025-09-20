
let mode = null; 
let columnCount = 2; 
const inputRowsConfig = [
    { id: 'material-cost-m3', label: 'Material Cost at Source (per m³)', defaultValue: 1500 },
    { id: 'tipper-rent-day', label: 'Tipper Rent (per Day)', defaultValue: 8000 },
    { id: 'total-tips-day', label: 'Total Trips (per Day)', defaultValue: 5 },
    { id: 'tipper-capacity', label: 'Tipper Capacity (m³)', defaultValue: 6 },
    { id: 'driver-cost-day', label: "Driver's Wage (per Day)", defaultValue: 1200 },
    { id: 'trip-length-km', label: 'Round Trip Distance (km)', defaultValue: 20 },
    { id: 'tipper-mileage', label: 'Tipper Mileage (km/Litre)', defaultValue: 3 },
    { id: 'diesel-price', label: 'Diesel Price (per Litre)', defaultValue: 170 }
];
const resultRowsConfig = [
    { id: 'material-cost-m3-result', label: 'Material Cost' },
    { id: 'tipper-cost-m3', label: 'Tipper Rent Cost' },
    { id: 'driver-cost-m3', label: "Driver Wage Cost" },
    { id: 'fuel-cost-m3', label: 'Fuel Cost' },
    { id: 'total-cost-m3', label: '<strong>Total Cost (per m³)</strong>' }
];


document.addEventListener('DOMContentLoaded', () => {
   
    document.getElementById('compare-sources-btn').addEventListener('click', () => showCalculator('source'));
    document.getElementById('compare-tippers-btn').addEventListener('click', () => showCalculator('tipper'));
    
  
    document.getElementById('back-btn').addEventListener('click', showSelectionScreen);
    document.getElementById('add-column-btn').addEventListener('click', addColumn);
    document.getElementById('calculate-btn').addEventListener('click', calculateAllCosts);

 
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
    }

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.removeItem('theme');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
});


function showCalculator(selectedMode) {
    mode = selectedMode;
    columnCount = 2; 
    document.getElementById('selection-screen').classList.add('hidden');
    document.getElementById('calculator-container').classList.remove('hidden');
    renderTables();
}

function showSelectionScreen() {
    document.getElementById('calculator-container').classList.add('hidden');
    document.getElementById('selection-screen').classList.remove('hidden');
}


function saveInputData() {
    const data = [];
    for (let i = 0; i < columnCount; i++) {
        const columnData = {};
        inputRowsConfig.forEach(row => {
            const inputElement = document.getElementById(`col-${i}-${row.id}`);
            if (inputElement) {
                columnData[row.id] = inputElement.value;
            }
        });
        data.push(columnData);
    }
    return data;
}

function restoreInputData(savedData) {
    savedData.forEach((columnData, i) => {
        inputRowsConfig.forEach(row => {
            const inputElement = document.getElementById(`col-${i}-${row.id}`);
            if (inputElement && columnData[row.id] !== undefined) {
                inputElement.value = columnData[row.id];
            }
        });
    });
}

function renderTables() {
    const itemLabel = mode === 'source' ? 'Source' : 'Tipper';
    document.getElementById('calculator-title').textContent = `Compare ${itemLabel} Efficiency`;
    document.getElementById('add-column-btn').textContent = `+ Add Another ${itemLabel}`;

    const inputThead = document.querySelector('#input-table thead');
    const inputTbody = document.querySelector('#input-table tbody');
    const resultsThead = document.querySelector('#results-table thead');
    const resultsTbody = document.querySelector('#results-table tbody');

    [inputThead, inputTbody, resultsThead, resultsTbody].forEach(el => el.innerHTML = '');

    let inputHeaderHTML = `<tr><th>Parameters</th>`;
    let resultsHeaderHTML = `<tr><th>Cost Breakdown (per m³)</th>`;
    for (let i = 0; i < columnCount; i++) {
        inputHeaderHTML += `<th>${itemLabel} ${i + 1}</th>`;
        resultsHeaderHTML += `<th>${itemLabel} ${i + 1}</th>`;
    }
    inputHeaderHTML += `</tr>`;
    resultsHeaderHTML += `</tr>`;
    inputThead.innerHTML = inputHeaderHTML;
    resultsThead.innerHTML = resultsHeaderHTML;
    
    inputRowsConfig.forEach(row => {
        let rowHTML = `<tr><td>${row.label}</td>`;
        for (let i = 0; i < columnCount; i++) {
            rowHTML += `<td><input type="number" id="col-${i}-${row.id}" min="0" step="0.01" value="${row.defaultValue}"></td>`;
        }
        rowHTML += `</tr>`;
        inputTbody.innerHTML += rowHTML;
    });

    resultRowsConfig.forEach(row => {
         let rowHTML = `<tr><td>${row.label}</td>`;
         for (let i = 0; i < columnCount; i++) {
            rowHTML += `<td><span id="col-${i}-${row.id}">0.00</span></td>`;
        }
        rowHTML += `</tr>`;
        resultsTbody.innerHTML += rowHTML;
    });
    
    resultsTbody.innerHTML += `<tr id="summary-row"><td colspan="${columnCount + 1}">-</td></tr>`;

    calculateAllCosts();
}

function addColumn() {
    const savedData = saveInputData();
    columnCount++;
    renderTables();
    restoreInputData(savedData);
    calculateAllCosts();
}


function calculateAllCosts() {
    let allTotals = [];

    for (let i = 0; i < columnCount; i++) {
        const values = {};
        inputRowsConfig.forEach(row => {
            const inputEl = document.getElementById(`col-${i}-${row.id}`);
            if (inputEl) values[row.id] = parseFloat(inputEl.value) || 0;
        });
        
        const totalVolumePerDay = (values['total-tips-day'] || 1) * (values['tipper-capacity'] || 1);
        const tipperCostM3 = totalVolumePerDay > 0 ? values['tipper-rent-day'] / totalVolumePerDay : 0;
        const driverCostM3 = totalVolumePerDay > 0 ? values['driver-cost-day'] / totalVolumePerDay : 0;

        const fuelPerTrip = (values['trip-length-km'] * values['diesel-price']) / (values['tipper-mileage'] || 1);
        const totalFuelCostPerDay = fuelPerTrip * values['total-tips-day'];
        const fuelCostM3 = totalVolumePerDay > 0 ? totalFuelCostPerDay / totalVolumePerDay : 0;

        const totalCostM3 = values['material-cost-m3'] + tipperCostM3 + driverCostM3 + fuelCostM3;
        allTotals.push(totalCostM3);

        document.getElementById(`col-${i}-material-cost-m3-result`).textContent = values['material-cost-m3'].toFixed(2);
        document.getElementById(`col-${i}-tipper-cost-m3`).textContent = tipperCostM3.toFixed(2);
        document.getElementById(`col-${i}-driver-cost-m3`).textContent = driverCostM3.toFixed(2);
        document.getElementById(`col-${i}-fuel-cost-m3`).textContent = fuelCostM3.toFixed(2);
        document.getElementById(`col-${i}-total-cost-m3`).textContent = totalCostM3.toFixed(2);
    }

    updateSummary(allTotals);
}

function updateSummary(totals) {
    const summaryCell = document.querySelector('#summary-row td');
    if (totals.length === 0) {
        summaryCell.textContent = "-";
        return;
    }

    const minValue = Math.min(...totals.filter(t => !isNaN(t)));
    if (!isFinite(minValue)) {
        summaryCell.textContent = "Please enter valid inputs.";
        return;
    }
    
    const cheapestIndices = [];
    totals.forEach((total, index) => {
        if (Math.abs(total - minValue) < 0.01) {
            cheapestIndices.push(index + 1);
        }
    });
    
    const itemLabel = mode === 'source' ? 'Source' : 'Tipper';
    
    if (cheapestIndices.length === totals.length && totals.length > 1) {
         summaryCell.textContent = `All options have a nearly identical cost of Rs. ${minValue.toFixed(2)} per m³.`;
    } else {
        summaryCell.textContent = `The most efficient option is ${itemLabel}(s) ${cheapestIndices.join(' & ')} at Rs. ${minValue.toFixed(2)} per m³.`;
    }
}
