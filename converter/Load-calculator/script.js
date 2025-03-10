const canvas = document.getElementById('canvas');
const grid = document.getElementById('grid');
const contextMenu = document.getElementById('contextMenu');
const scale = 100; // 100 pixels per meter
let elements = { columns: [], beams: [], slabs: [] };
let selectedElement = null;
let mode = 'none';
let unit = 'm';
let snapDistance = 10; // Pixels for snapping

// Conversion factors to meters
const unitConversions = {
    m: 1,
    cm: 0.01,
    mm: 0.001,
    ft: 0.3048,
    in: 0.0254
};

// Event listeners for toolbar
document.getElementById('addColumn').addEventListener('click', () => { mode = 'addingColumn'; });
document.getElementById('addBeam').addEventListener('click', () => { mode = 'addingBeam'; });
document.getElementById('addSlab').addEventListener('click', () => { mode = 'addingSlab'; window.slabPoints = []; });
document.getElementById('calculateLoads').addEventListener('click', calculateLoads);
document.getElementById('units').addEventListener('change', (e) => { unit = e.target.value; });

// Context menu buttons
document.getElementById('editBtn').addEventListener('click', () => { editDimensions(selectedElement); hideContextMenu(); });
document.getElementById('moveBtn').addEventListener('click', () => { mode = 'moving'; hideContextMenu(); });
document.getElementById('copyBtn').addEventListener('click', () => { copyElement(); hideContextMenu(); });
document.getElementById('deleteBtn').addEventListener('click', () => { deleteElement(); hideContextMenu(); });
document.getElementById('resizeLeftBtn').addEventListener('click', () => { mode = 'resizingLeft'; hideContextMenu(); });
document.getElementById('resizeRightBtn').addEventListener('click', () => { mode = 'resizingRight'; hideContextMenu(); });

// Canvas click handler
canvas.addEventListener('click', (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    hideContextMenu();
    if (mode === 'addingColumn') {
        addColumn(x, y);
        mode = 'none';
    } else if (mode === 'addingBeam') {
        addBeam(x, y);
        mode = 'none';
    } else if (mode === 'addingSlab') {
        window.slabPoints.push({ x, y });
        if (window.slabPoints.length === 2) {
            addSlab(window.slabPoints[0], window.slabPoints[1]);
            window.slabPoints = [];
            mode = 'none';
        }
    }
});

// Right-click for context menu
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const element = getElementAtPosition(e.offsetX, e.offsetY);
    if (element) {
        selectedElement = element;
        showContextMenu(e.pageX, e.pageY);
        document.getElementById('resizeLeftBtn').style.display = element.className === 'slab' || element.className === 'beam' ? 'block' : 'none';
        document.getElementById('resizeRightBtn').style.display = element.className === 'slab' || element.className === 'beam' ? 'block' : 'none';
    }
});

// Helper functions
function getElementAtPosition(x, y) {
    for (let type in elements) {
        for (let el of elements[type]) {
            const rect = el.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            const elX = rect.left - canvasRect.left;
            const elY = rect.top - canvasRect.top;
            const elW = rect.width;
            const elH = rect.height;
            if (x >= elX && x <= elX + elW && y >= elY && y <= elY + elH) return el;
        }
    }
    return null;
}

function getNearestColumn(x, y) {
    let nearest = null;
    let minDist = snapDistance;
    for (let column of elements.columns) {
        const cx = parseFloat(column.style.left) + 6;
        const cy = parseFloat(column.style.top) + 6;
        const dist = Math.hypot(x - cx, y - cy);
        if (dist < minDist) {
            minDist = dist;
            nearest = { x: cx, y: cy, column };
        }
    }
    return nearest;
}

function highlightAxes(element) {
    document.querySelectorAll('.x-axis-highlight, .y-axis-highlight').forEach(el => el.remove());
    if (element.className !== 'column' || mode !== 'moving') return;

    const x = parseFloat(element.style.left) + 6;
    const y = parseFloat(element.style.top) + 6;

    elements.columns.forEach(other => {
        if (other === element) return;
        const otherX = parseFloat(other.style.left) + 6;
        const otherY = parseFloat(other.style.top) + 6;

        if (Math.abs(y - otherY) < 2) {
            const highlight = document.createElement('div');
            highlight.className = 'x-axis-highlight';
            highlight.style.top = otherY - 1 + 'px';
            grid.appendChild(highlight);
        }

        if (Math.abs(x - otherX) < 2) {
            const highlight = document.createElement('div');
            highlight.className = 'y-axis-highlight';
            highlight.style.left = otherX - 1 + 'px';
            grid.appendChild(highlight);
        }
    });
}

// Add elements
function addColumn(x, y) {
    const column = document.createElement('div');
    column.className = 'column';
    column.style.left = (x - 6) + 'px';
    column.style.top = (y - 6) + 'px';
    canvas.appendChild(column);
    elements.columns.push(column);
    makeInteractive(column);
    const width = prompt(`Enter column width (${unit})`, '0.3');
    const depth = prompt(`Enter column depth (${unit})`, '0.3');
    const height = prompt(`Enter column height (${unit})`, '3');
    if (width && depth && height) {
        column.dataset.width = parseFloat(width) * unitConversions[unit];
        column.dataset.depth = parseFloat(depth) * unitConversions[unit];
        column.dataset.height = parseFloat(height) * unitConversions[unit];
    }
}

function addBeam(x, y) {
    const beam = document.createElement('div');
    beam.className = 'beam';
    beam.style.left = x + 'px';
    beam.style.top = y + 'px';
    beam.style.width = '50px';
    beam.style.height = '12px';
    canvas.appendChild(beam);
    elements.beams.push(beam);
    makeInteractive(beam);
    const width = prompt(`Enter beam width (${unit})`, '0.3');
    const depth = prompt(`Enter beam depth (${unit})`, '0.4');
    if (width && depth) {
        beam.dataset.width = parseFloat(width) * unitConversions[unit];
        beam.dataset.depth = parseFloat(depth) * unitConversions[unit];
        beam.dataset.length = parseFloat(beam.style.width) / scale;
    }
    checkBeamConnections(beam);
}

function addSlab(point1, point2) {
    const slab = document.createElement('div');
    slab.className = 'slab';
    const left = Math.min(point1.x, point2.x);
    const top = Math.min(point1.y, point2.y);
    const widthPx = Math.abs(point1.x - point2.x);
    const heightPx = Math.abs(point1.y - point2.y);
    slab.style.left = left + 'px';
    slab.style.top = top + 'px';
    slab.style.width = widthPx + 'px';
    slab.style.height = heightPx + 'px';
    slab.dataset.width = widthPx / scale;
    slab.dataset.length = heightPx / scale;
    canvas.appendChild(slab);
    elements.slabs.push(slab);
    makeInteractive(slab);
    const thickness = prompt(`Enter slab thickness (${unit}) (Width: ${(widthPx / scale).toFixed(2)}m, Length: ${(heightPx / scale).toFixed(2)}m)`, '0.15');
    if (thickness) {
        slab.dataset.thickness = parseFloat(thickness) * unitConversions[unit];
    }
}

// Context menu functions
function showContextMenu(x, y) {
    contextMenu.style.display = 'block';
    contextMenu.style.left = x + 'px';
    contextMenu.style.top = y + 'px';
}

function hideContextMenu() {
    contextMenu.style.display = 'none';
}

function editDimensions(el) {
    if (!el) return;
    if (el.className === 'column') {
        const width = prompt(`Enter column width (${unit})`, el.dataset.width / unitConversions[unit] || '0.3');
        const depth = prompt(`Enter column depth (${unit})`, el.dataset.depth / unitConversions[unit] || '0.3');
        const height = prompt(`Enter column height (${unit})`, el.dataset.height / unitConversions[unit] || '3');
        if (width && depth && height) {
            el.dataset.width = parseFloat(width) * unitConversions[unit];
            el.dataset.depth = parseFloat(depth) * unitConversions[unit];
            el.dataset.height = parseFloat(height) * unitConversions[unit];
        }
    } else if (el.className === 'beam') {
        const width = prompt(`Enter beam width (${unit})`, el.dataset.width / unitConversions[unit] || '0.3');
        const depth = prompt(`Enter beam depth (${unit})`, el.dataset.depth / unitConversions[unit] || '0.4');
        if (width && depth) {
            el.dataset.width = parseFloat(width) * unitConversions[unit];
            el.dataset.depth = parseFloat(depth) * unitConversions[unit];
            el.dataset.length = parseFloat(el.style.width) / scale;
        }
    } else if (el.className === 'slab') {
        const thickness = prompt(`Enter slab thickness (${unit}) (Width: ${(parseFloat(el.style.width) / scale).toFixed(2)}m, Length: ${(parseFloat(el.style.height) / scale).toFixed(2)}m)`, el.dataset.thickness / unitConversions[unit] || '0.15');
        if (thickness) {
            el.dataset.thickness = parseFloat(thickness) * unitConversions[unit];
        }
    }
}

function copyElement() {
    if (!selectedElement) return;
    if (selectedElement.className === 'column') {
        const newColumn = document.createElement('div');
        newColumn.className = 'column';
        newColumn.style.left = (parseFloat(selectedElement.style.left) + 20) + 'px';
        newColumn.style.top = selectedElement.style.top;
        newColumn.dataset.width = selectedElement.dataset.width;
        newColumn.dataset.depth = selectedElement.dataset.depth;
        newColumn.dataset.height = selectedElement.dataset.height;
        canvas.appendChild(newColumn);
        elements.columns.push(newColumn);
        makeInteractive(newColumn);
    } else if (selectedElement.className === 'slab') {
        const newSlab = document.createElement('div');
        newSlab.className = 'slab';
        newSlab.style.left = (parseFloat(selectedElement.style.left) + 20) + 'px';
        newSlab.style.top = selectedElement.style.top;
        newSlab.style.width = selectedElement.style.width;
        newSlab.style.height = selectedElement.style.height;
        newSlab.dataset.width = selectedElement.dataset.width;
        newSlab.dataset.length = selectedElement.dataset.length;
        newSlab.dataset.thickness = selectedElement.dataset.thickness;
        canvas.appendChild(newSlab);
        elements.slabs.push(newSlab);
        makeInteractive(newSlab);
    }
}

function deleteElement() {
    if (!selectedElement) return;
    if (selectedElement.className === 'column') elements.columns = elements.columns.filter(c => c !== selectedElement);
    else if (selectedElement.className === 'beam') elements.beams = elements.beams.filter(b => b !== selectedElement);
    else if (selectedElement.className === 'slab') elements.slabs = elements.slabs.filter(s => s !== selectedElement);
    canvas.removeChild(selectedElement);
    selectedElement = null;
}

// Interaction handler
function makeInteractive(element) {
    element.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevent default behavior
        if (e.button === 0 && (mode === 'moving' || mode === 'resizingLeft' || mode === 'resizingRight')) {
            selectedElement = element;
            const offsetX = e.clientX - parseFloat(element.style.left);
            const offsetY = e.clientY - parseFloat(element.style.top);
            element.classList.add('dragging');

            document.onmousemove = (e) => {
                if (!selectedElement) return;

                if (mode === 'moving') {
                    let newX = e.clientX - offsetX;
                    let newY = e.clientY - offsetY;
                    // Restrict movement to canvas bounds
                    newX = Math.max(0, Math.min(newX, canvas.offsetWidth - element.offsetWidth));
                    newY = Math.max(0, Math.min(newY, canvas.offsetHeight - element.offsetHeight));
                    if (selectedElement.className === 'beam') {
                        const snapLeft = getNearestColumn(newX, newY);
                        const snapRight = getNearestColumn(newX + parseFloat(selectedElement.style.width), newY);
                        if (snapLeft) newX = snapLeft.x - 6;
                        if (snapRight) newX = snapRight.x - parseFloat(selectedElement.style.width) - 6;
                    }
                    selectedElement.style.left = newX + 'px';
                    selectedElement.style.top = newY + 'px';
                    if (selectedElement.className === 'beam') checkBeamConnections(selectedElement);
                    highlightAxes(selectedElement);
                } else if (mode === 'resizingLeft' && (selectedElement.className === 'beam' || selectedElement.className === 'slab')) {
                    const newWidth = parseFloat(selectedElement.style.left) + parseFloat(selectedElement.style.width) - (e.clientX - offsetX);
                    if (newWidth > 10) {
                        const newLeft = e.clientX - offsetX;
                        if (newLeft >= 0) {
                            selectedElement.style.left = newLeft + 'px';
                            selectedElement.style.width = newWidth + 'px';
                            if (selectedElement.className === 'beam') checkBeamConnections(selectedElement);
                            else selectedElement.dataset.width = newWidth / scale;
                        }
                    }
                } else if (mode === 'resizingRight' && (selectedElement.className === 'beam' || selectedElement.className === 'slab')) {
                    const newWidth = e.clientX - offsetX - parseFloat(selectedElement.style.left);
                    if (newWidth > 10 && (parseFloat(selectedElement.style.left) + newWidth) <= canvas.offsetWidth) {
                        selectedElement.style.width = newWidth + 'px';
                        if (selectedElement.className === 'beam') checkBeamConnections(selectedElement);
                        else selectedElement.dataset.width = newWidth / scale;
                    }
                }
            };

            document.onmouseup = () => {
                if (selectedElement) {
                    selectedElement.classList.remove('dragging');
                    mode = 'none';
                    selectedElement = null;
                    document.querySelectorAll('.x-axis-highlight, .y-axis-highlight').forEach(el => el.remove());
                }
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    });
}

function checkBeamConnections(beam) {
    const leftX = parseFloat(beam.style.left) + 6;
    const rightX = leftX + parseFloat(beam.style.width);
    const y = parseFloat(beam.style.top) + 6;
    const leftSnap = getNearestColumn(leftX, y);
    const rightSnap = getNearestColumn(rightX, y);
    beam.classList.toggle('error', !(leftSnap && rightSnap));
    beam.dataset.column1 = leftSnap ? elements.columns.indexOf(leftSnap.column) : -1;
    beam.dataset.column2 = rightSnap ? elements.columns.indexOf(rightSnap.column) : -1;
    beam.dataset.length = parseFloat(beam.style.width) / scale;
}

// Load calculations
function calculateLoads() {
    const density = parseFloat(document.getElementById('density').value);
    const liveLoad = parseFloat(document.getElementById('liveLoad').value);

    elements.columns.forEach(c => {
        c.deadLoad = c.dataset.width * c.dataset.depth * c.dataset.height * density;
    });
    elements.beams.forEach(b => {
        b.deadLoad = b.dataset.width * b.dataset.depth * b.dataset.length * density;
    });
    elements.slabs.forEach(s => {
        s.deadLoad = s.dataset.width * s.dataset.length * s.dataset.thickness * density;
        s.liveLoad = s.dataset.width * s.dataset.length * liveLoad;
    });

    elements.slabs.forEach(slab => {
        const slabRect = {
            left: parseFloat(slab.style.left),
            top: parseFloat(slab.style.top),
            right: parseFloat(slab.style.left) + parseFloat(slab.style.width),
            bottom: parseFloat(slab.style.top) + parseFloat(slab.style.height)
        };
        const supportingBeams = elements.beams.filter(b => {
            const leftX = parseFloat(b.style.left) + 6;
            const rightX = leftX + parseFloat(b.style.width);
            const y = parseFloat(b.style.top) + 6;
            if (y > slabRect.top && y < slabRect.bottom && rightX > slabRect.left && leftX < slabRect.right) return true;
            return false;
        });
        if (supportingBeams.length > 0) {
            const totalSlabLoad = slab.deadLoad + slab.liveLoad;
            const loadPerBeam = totalSlabLoad / supportingBeams.length;
            supportingBeams.forEach(b => {
                b.slabLoad = (b.slabLoad || 0) + loadPerBeam;
            });
        }
    });

    elements.beams.forEach(b => {
        b.totalLoad = b.deadLoad + (b.slabLoad || 0);
    });

    elements.columns.forEach(c => c.beamLoad = 0);
    elements.beams.forEach(b => {
        if (b.dataset.column1 >= 0 && b.dataset.column2 >= 0) {
            const c1 = elements.columns[b.dataset.column1];
            const c2 = elements.columns[b.dataset.column2];
            const loadPerColumn = b.totalLoad / 2;
            c1.beamLoad += loadPerColumn;
            c2.beamLoad += loadPerColumn;
        }
    });

    elements.columns.forEach(c => {
        c.totalLoad = c.deadLoad + c.beamLoad;
    });

    let html = '<h2>Load Calculations</h2>';
    html += '<h3>Beams</h3>';
    elements.beams.forEach((b, i) => html += `<p>Beam b${i}: ${b.totalLoad.toFixed(2)} kN (DL: ${b.deadLoad.toFixed(2)}, Slab Load: ${(b.slabLoad || 0).toFixed(2)})</p>`);
    html += '<h3>Columns</h3>';
    elements.columns.forEach((c, i) => html += `<p>Column c${i}: ${c.totalLoad.toFixed(2)} kN (DL: ${c.deadLoad.toFixed(2)}, Beam Load: ${c.beamLoad.toFixed(2)})</p>`);
    document.getElementById('results').innerHTML = html;
}
