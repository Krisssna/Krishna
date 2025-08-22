document.addEventListener('DOMContentLoaded', () => {
    let currentChart = null;
    let columns = 3;
    let rows = 3;
    const maxColumns = 100;
    const maxRows = 500;
    const minColumns = 1;
    const minRows = 1;
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#e74c3c', '#2ecc71'];

    const tableHeader = document.getElementById('excelHeader');
    const tableBody = document.getElementById('excelBody');
    const canvas = document.getElementById('myChart');
    const updateChartBtn = document.getElementById('updateChartBtn');
    const fullscreenToggle = document.getElementById('fullscreenToggle');
    const visualizationWrapper = document.getElementById('visualizationWrapper');
    const showLabelsCheckbox = document.getElementById('showLabelsOnChart');

    const lineLabelsPlugin = {
        id: 'lineLabels',
        afterDatasetsDraw: (chart) => {
            if (!showLabelsCheckbox.checked) return;
            const { ctx } = chart;
            ctx.save();
            ctx.font = 'bold 12px sans-serif';
            chart.data.datasets.forEach((dataset, i) => {
                if (dataset.data.length === 0 || !chart.isDatasetVisible(i)) return;
                const meta = chart.getDatasetMeta(i);
                const lastPoint = meta.data[meta.data.length - 1];
                if (lastPoint) {
                    ctx.fillStyle = dataset.borderColor;
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(dataset.label, lastPoint.x + 8, lastPoint.y);
                }
            });
            ctx.restore();
        }
    };

    function initializeChart() {
        if (currentChart) currentChart.destroy();
        currentChart = new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: { datasets: [] },
            plugins: [lineLabelsPlugin],
            options: {
                responsive: true, maintainAspectRatio: false, animation: { duration: 0 },
                plugins: { legend: { position: 'right', display: true }, tooltip: { mode: 'index', intersect: false } },
                scales: {
                    x: {
                        type: 'linear', position: 'bottom', title: { display: true, text: 'Time' },
                        ticks: {
                            autoSkip: false,
                            callback: function(value) {
                                const timeLabels = this.chart.timeLabels || [];
                                return timeLabels.includes(value) ? value : null;
                            }
                        }
                    },
                    y: {
                        type: 'linear', position: 'left', title: { display: true, text: 'Value' },
                        grace: '15%'
                    }
                },
                elements: { line: { tension: 0.4 }, point: { radius: 2 } }
            }
        });
    }

    function getTableState() {
        const headers = Array.from(tableHeader.querySelectorAll('.th-content input')).map(input => input.value);
        const data = Array.from(tableBody.querySelectorAll('.table-row')).map(row => 
            Array.from(row.querySelectorAll('input')).map(input => input.value)
        );
        return { headers, data };
    }
    
    function renderTableFromState(headers, data) {
        tableHeader.innerHTML = '';
        tableBody.innerHTML = '';
    
        const gridTemplateColumns = `1.5fr repeat(${columns}, 1fr)`;
        tableHeader.style.gridTemplateColumns = gridTemplateColumns;
        tableBody.style.gridTemplateColumns = gridTemplateColumns;
    
        headers.forEach((headerText, i) => {
            tableHeader.appendChild(createHeaderCell(i - 1, headerText));
        });
    
        data.forEach((rowData, i) => {
            const rowWrapper = document.createElement('div');
            rowWrapper.className = 'table-row';
            createRow(columns, i, rowData).forEach(cell => rowWrapper.appendChild(cell));
            tableBody.appendChild(rowWrapper);
        });
    }
    
    function getTableDataForChart() {
        const { data } = getTableState();
        if (data.length === 0) return { datasets: [] };

        const columnNames = Array.from(tableHeader.querySelectorAll('.th-content input')).slice(1).map(input => input.value);
        const datasets = columnNames.map((name, i) => ({
            label: name, data: [], borderColor: colors[i % colors.length], fill: false
        }));

        data.forEach(row => {
            const time = parseFloat(row[0]) || 0;
            for (let i = 0; i < columns; i++) {
                datasets[i].data.push({ x: time, y: parseFloat(row[i + 1]) || 0 });
            }
        });
        return { datasets };
    }

    function runAnimation() {
        const { datasets: fullDatasets } = getTableDataForChart();
        if (!currentChart || fullDatasets.length === 0 || fullDatasets[0].data.length < 2) return;

        setUIBusy(true, "Animating...");
        
        const allXValues = fullDatasets[0].data.map(p => p.x);
        currentChart.options.scales.x.min = Math.min(...allXValues);
        currentChart.options.scales.x.max = Math.max(...allXValues);
        currentChart.timeLabels = allXValues;
        
        const lookaheadPoints = Math.min(fullDatasets[0].data.length, 3);
        const initialDataPoints = fullDatasets.flatMap(ds => ds.data.slice(0, lookaheadPoints));
        const initialYValues = initialDataPoints.length > 0 ? initialDataPoints.map(p => p.y) : [0];
        let yMin = Math.min(...initialYValues);
        let yMax = Math.max(...initialYValues);
        let yRange = yMax - yMin || 1;
        
        const initialScale = {
            min: yMin - yRange * 0.2,
            max: yMax + yRange * 0.2
        };

        currentChart.options.scales.y.min = initialScale.min;
        currentChart.options.scales.y.max = initialScale.max;
        currentChart.targetScale = { ...initialScale };
        
        currentChart.data.datasets = fullDatasets.map(ds => ({ ...ds, data: [] }));

        let startTime = null;
        let lastLookaheadIndex = -1;
        const totalDuration = parseFloat(document.getElementById('animationSpeed').value) * 1000;

        function animationStep(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / totalDuration, 1);
            const targetData = fullDatasets[0].data;
            const maxPointIndex = (targetData.length - 1) * progress;
            const upcomingPointIndex = Math.min(Math.ceil(maxPointIndex), targetData.length - 1);

            for (let i = 0; i < fullDatasets.length; i++) {
                const currentTargetData = fullDatasets[i].data;
                const currentData = [];
                for (let j = 0; j < currentTargetData.length; j++) {
                    let point;
                    if (j <= maxPointIndex) {
                        point = currentTargetData[j];
                    } else {
                        const from = currentTargetData[j - 1], to = currentTargetData[j];
                        const segmentProgress = maxPointIndex - (j - 1);
                        point = {
                            x: from.x + (to.x - from.x) * segmentProgress,
                            y: from.y + (to.y - from.y) * segmentProgress
                        };
                        currentData.push(point);
                        break; 
                    }
                    currentData.push(point);
                }
                currentChart.data.datasets[i].data = currentData;
            }

            if (upcomingPointIndex > lastLookaheadIndex) {
                let needsRescale = false;
                for (const ds of fullDatasets) {
                    if (ds.data[upcomingPointIndex]) {
                        const upcomingPointY = ds.data[upcomingPointIndex].y;
                        if (upcomingPointY > currentChart.targetScale.max || upcomingPointY < currentChart.targetScale.min) {
                            needsRescale = true;
                            break;
                        }
                    }
                }
                
                if (needsRescale) {
                    const visiblePoints = fullDatasets.flatMap(ds => ds.data.slice(0, upcomingPointIndex + 1));
                    const visibleY = visiblePoints.map(p => p.y);
                    const visibleYMin = Math.min(...visibleY);
                    const visibleYMax = Math.max(...visibleY);
                    const visibleRange = visibleYMax - visibleYMin || 1;
                    currentChart.targetScale.min = visibleYMin - visibleRange * 0.2;
                    currentChart.targetScale.max = visibleYMax + visibleRange * 0.2;
                }
                lastLookaheadIndex = upcomingPointIndex;
            }
            
            const easingFactor = 0.06;
            currentChart.options.scales.y.min += (currentChart.targetScale.min - currentChart.options.scales.y.min) * easingFactor;
            currentChart.options.scales.y.max += (currentChart.targetScale.max - currentChart.options.scales.y.max) * easingFactor;

            currentChart.update('none');

            if (progress < 1) {
                requestAnimationFrame(animationStep);
            } else {
                currentChart.data.datasets.forEach((ds, i) => ds.data = fullDatasets[i].data);
                currentChart.update('none');
                setUIBusy(false);
            }
        }
        requestAnimationFrame(animationStep);
    }
    
    function setUIBusy(isBusy, message = '') {
        updateChartBtn.disabled = isBusy;
        updateChartBtn.innerHTML = isBusy ? `<i class="fa-solid fa-spinner fa-spin"></i> ${message}` : `<i class="fa-solid fa-play"></i> Animate Chart`;
    }

    function toggleLegends() { if (currentChart) { currentChart.options.plugins.legend.display = !currentChart.options.plugins.legend.display; currentChart.update(); }}

    function handleTableClick(event) {
        const button = event.target.closest('button.control-btn');
        if (!button) return;
        
        const { headers, data } = getTableState();
        const action = button.dataset.action;
        const cell = button.closest('.table-cell, .table-header-cell');
        const rowElement = cell.parentElement;

        if (action.includes('row')) {
            const rowIndex = Array.from(rowElement.parentElement.children).indexOf(rowElement);
            if (action === 'add-row') {
                if (rows < maxRows) {
                    rows++;
                    const newRow = Array(columns + 1).fill('0');
                    newRow[0] = rows;
                    data.splice(rowIndex + 1, 0, newRow);
                }
            } else if (action === 'del-row') {
                if (rows > minRows) {
                    rows--;
                    data.splice(rowIndex, 1);
                }
            }
            renderTableFromState(headers, data);
        } else if (action.includes('col')) {
            const colIndex = Array.from(cell.parentElement.children).indexOf(cell);
            if (action === 'add-col') {
                if (columns < maxColumns) {
                    columns++;
                    headers.splice(colIndex + 1, 0, `Series ${columns}`);
                    data.forEach(d => d.splice(colIndex + 1, 0, '0'));
                }
            } else if (action === 'del-col') {
                if (columns > minColumns) {
                    columns--;
                    headers.splice(colIndex, 1);
                    data.forEach(d => d.splice(colIndex, 1));
                }
            }
            renderTableFromState(headers, data);
        }
    }

    function createRow(numCols, rowIndex, rowData = []) {
        const cells = [];
        const timeCell = document.createElement('div');
        timeCell.className = 'table-cell';
        timeCell.innerHTML = `<div class="row-controls"><button class="control-btn add-btn" data-action="add-row">+</button><button class="control-btn del-btn" data-action="del-row">-</button></div><input type="number" value="${rowData[0] ?? rowIndex + 1}">`;
        cells.push(timeCell);

        for (let j = 0; j < numCols; j++) {
            const dataCell = document.createElement('div');
            dataCell.className = 'table-cell';
            dataCell.innerHTML = `<input type="number" value="${rowData[j + 1] ?? 0}">`;
            cells.push(dataCell);
        }
        return cells;
    }

    function createHeaderCell(colIndex, headerText) {
        const th = document.createElement('div');
        th.className = 'table-header-cell';
        if (colIndex === -1) {
            th.innerHTML = `<div class="th-content"><input type="text" value="${headerText ?? 'Time'}"></div>`;
        } else {
            th.innerHTML = `<div class="th-content"><div class="column-controls"><button class="control-btn add-btn" data-action="add-col">+</button><button class="control-btn del-btn" data-action="del-col">-</button></div><input type="text" value="${headerText ?? `Series ${colIndex + 1}`}"></div>`;
        }
        return th;
    }
    
    function exportCSV() {
        const { headers, data } = getTableState();
        const csvContent = [
            headers.map(h => `"${h}"`).join(','),
            ...data.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.csv';
        link.click();
        URL.revokeObjectURL(link.href);
    }
    
    function handleFileUpload(event) {
        const file = event.target.files[0]; if (!file) return;
        const reader = new FileReader(); const extension = file.name.split('.').pop().toLowerCase();
        reader.onload = (e) => {
            let dataArray;
            if (extension === 'csv') { dataArray = Papa.parse(e.target.result, { header: false }).data; }
            else if (extension === 'xlsx') { const workbook = XLSX.read(e.target.result, { type: 'array' }); dataArray = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 }); }
            else { return alert('Unsupported file type.'); }
            updateTableFromData(dataArray);
        };
        if (extension === 'csv') reader.readAsText(file); else if (extension === 'xlsx') reader.readAsArrayBuffer(file);
    }

    function updateTableFromData(data) {
        data = data.filter(row => row.some(cell => cell != null && cell.toString().trim() !== ''));
        if (data.length < 1) return;
        const headers = data[0];
        const tableData = data.slice(1);
        if (tableData.length < 1) return;
        columns = headers.length - 1;
        rows = tableData.length;
        renderTableFromState(headers, tableData);
        runAnimation();
    }
    
    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            visualizationWrapper.requestFullscreen().catch(err => {
                console.error(`Fullscreen Error: ${err.message}`, err);
                alert(`Could not enter fullscreen mode. This feature may not be supported by your browser or may be blocked.`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    fullscreenToggle.addEventListener('click', toggleFullScreen);
    document.getElementById('excelTable').addEventListener('click', handleTableClick);
    document.addEventListener('fullscreenchange', () => {
        const icon = fullscreenToggle.querySelector('i');
        if (document.fullscreenElement) {
            icon.classList.replace('fa-expand', 'fa-compress');
        } else {
            icon.classList.replace('fa-compress', 'fa-expand');
        }
    });

    function initializeEmptyTable() {
        const headers = ['Time', ...Array.from({ length: columns }, (_, i) => `Series ${i + 1}`)];
        const data = Array.from({ length: rows }, (_, i) => [i + 1, ...Array.from({ length: columns }, () => Math.floor(Math.random() * 100))]);
        renderTableFromState(headers, data);
        runAnimation();
    }

    Object.assign(window, { runAnimation, toggleLegends, exportCSV, handleFileUpload });

    initializeChart();
    initializeEmptyTable();
});