const canvas = document.getElementById('canvas');
const crosshairX = document.getElementById('crosshair-x');
const crosshairY = document.getElementById('crosshair-y');
const dynamicLabel = document.getElementById('dynamic-label');
const toggleSnapBtn = document.getElementById('toggleSnap');
const scale = 100; // 100 pixels per meter
let mode = 'none';
let startPoint = null;
let elements = [];
let tempElement = null;
let selectedElement = null;
let resizeMode = null;
let snapEnabled = true;
const snapDistance = 10; // Pixels

// Toolbar buttons
document.getElementById('drawColumn').addEventListener('click', () => {
    mode = 'column';
    updateToolbar();
});
document.getElementById('drawBeam').addEventListener('click', () => {
    mode = 'beam';
    updateToolbar();
});
document.getElementById('drawSlab').addEventListener('click', () => {
    mode = 'slab';
    updateToolbar();
});
toggleSnapBtn.addEventListener('click', () => {
    snapEnabled = !snapEnabled;
    toggleSnapBtn.textContent = `Snap ${snapEnabled ? 'On' : 'Off'}`;
});

// Update toolbar button states
function updateToolbar() {
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    if (mode === 'column') document.getElementById('drawColumn').classList.add('active');
    else if (mode === 'beam') document.getElementById('drawBeam').classList.add('active');
    else if (mode === 'slab') document.getElementById('drawSlab').classList.add('active');
}

// Crosshair movement and dynamic preview
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    crosshairX.style.top = y + 'px';
    crosshairY.style.left = x + 'px';

    if (startPoint && (mode === 'beam' || mode === 'slab') && tempElement) {
        updateTempElement(x, y);
    } else if (selectedElement && mode === 'moving') {
        const dx = x - startPoint.x;
        const dy = y - startPoint.y;
        let newX = parseFloat(selectedElement.style.left) + dx;
        let newY = parseFloat(selectedElement.style.top) + dy;

        if (snapEnabled) {
            const snapPoint = getSnapPoint(newX, newY, selectedElement);
            newX = snapPoint.x;
            newY = snapPoint.y;
        }

        selectedElement.style.left = newX + 'px';
        selectedElement.style.top = newY + 'px';
        startPoint = { x, y };
    } else if (selectedElement && resizeMode) {
        resizeElement(x, y);
    } else {
        dynamicLabel.style.display = 'none';
    }
});

// Drawing and interaction logic
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === 'column') {
        addColumn(x, y);
        mode = 'none';
        updateToolbar();
    } else if (mode === 'beam' || mode === 'slab') {
        startPoint = { x, y };
        tempElement = document.createElement('div');
        tempElement.className = mode === 'beam' ? 'beam' : 'slab';
        tempElement.style.opacity = '0.5';
        canvas.appendChild(tempElement);
    } else {
        const target = e.target;
        if (target.classList.contains('resize-handle')) {
            selectedElement = target.parentElement;
            resizeMode = target.dataset.direction;
            startPoint = { x, y };
        } else if (target.classList.contains('column') || target.classList.contains('beam') || target.classList.contains('slab')) {
            selectedElement = target;
            mode = 'moving';
            startPoint = { x, y };
            removeResizeHandles();
            addResizeHandles(selectedElement);
        }
    }
});

canvas.addEventListener('mouseup', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (startPoint && (mode === 'beam' || mode === 'slab') && tempElement) {
        if (mode === 'beam') addBeam(startPoint.x, startPoint.y, x, y);
        else if (mode === 'slab') addSlab(startPoint.x, startPoint.y, x, y);
        canvas.removeChild(tempElement);
        tempElement = null;
        startPoint = null;
        dynamicLabel.style.display = 'none';
        mode = 'none';
        updateToolbar();
    } else if (selectedElement && (mode === 'moving' || resizeMode)) {
        mode = 'none';
        resizeMode = null;
        selectedElement = null;
        startPoint = null;
    }
});

canvas.addEventListener('dblclick', (e) => {
    const target = e.target;
    if (target.classList.contains('column') || target.classList.contains('beam') || target.classList.contains('slab')) {
        editElement(target);
    }
});

// Add elements
function addColumn(x, y) {
    const column = document.createElement('div');
    column.className = 'column';
    column.style.left = (x - 5) + 'px';
    column.style.top = (y - 5) + 'px';
    canvas.appendChild(column);
    elements.push({ type: 'column', element: column });

    const width = prompt('Enter column width (m)', '0.3');
    const depth = prompt('Enter column depth (m)', '0.3');
    const height = prompt('Enter column height (m)', '3');
    if (width && depth && height) {
        column.dataset.width = parseFloat(width);
        column.dataset.depth = parseFloat(depth);
        column.dataset.height = parseFloat(height);
    }
}

function addBeam(x1, y1, x2, y2) {
    const beam = document.createElement('div');
    beam.className = 'beam';
    const left = Math.min(x1, x2);
    const top = y1;
    const width = Math.abs(x2 - x1);
    beam.style.left = left + 'px';
    beam.style.top = top + 'px';
    beam.style.width = width + 'px';
    beam.style.height = '10px';
    canvas.appendChild(beam);
    elements.push({ type: 'beam', element: beam });

    const length = width / scale;
    const widthPrompt = prompt(`Enter beam width (m) (Length: ${length.toFixed(2)}m)`, '0.3');
    const depth = prompt('Enter beam depth (m)', '0.4');
    if (widthPrompt && depth) {
        beam.dataset.width = parseFloat(widthPrompt);
        beam.dataset.depth = parseFloat(depth);
        beam.dataset.length = length;
    }
}

function addSlab(x1, y1, x2, y2) {
    const slab = document.createElement('div');
    slab.className = 'slab';
    const left = Math.min(x1, x2);
    const top = Math.min(y1, y2);
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);
    slab.style.left = left + 'px';
    slab.style.top = top + 'px';
    slab.style.width = width + 'px';
    slab.style.height = height + 'px';
    canvas.appendChild(slab);
    elements.push({ type: 'slab', element: slab });

    const length = width / scale;
    const widthSlab = height / scale;
    const thickness = prompt(`Enter slab thickness (m) (Length: ${length.toFixed(2)}m, Width: ${widthSlab.toFixed(2)}m)`, '0.15');
    if (thickness) {
        slab.dataset.thickness = parseFloat(thickness);
        slab.dataset.length = length;
        slab.dataset.width = widthSlab;
    }
}

// Editing functions
function editElement(element) {
    if (element.className === 'column') {
        const width = prompt('Enter column width (m)', element.dataset.width || '0.3');
        const depth = prompt('Enter column depth (m)', element.dataset.depth || '0.3');
        const height = prompt('Enter column height (m)', element.dataset.height || '3');
        if (width && depth && height) {
            element.dataset.width = parseFloat(width);
            element.dataset.depth = parseFloat(depth);
            element.dataset.height = parseFloat(height);
        }
    } else if (element.className === 'beam') {
        const width = prompt(`Enter beam width (m) (Length: ${element.dataset.length}m)`, element.dataset.width || '0.3');
        const depth = prompt('Enter beam depth (m)', element.dataset.depth || '0.4');
        if (width && depth) {
            element.dataset.width = parseFloat(width);
            element.dataset.depth = parseFloat(depth);
        }
    } else if (element.className === 'slab') {
        const thickness = prompt(`Enter slab thickness (m) (Length: ${element.dataset.length}m, Width: ${element.dataset.width}m)`, element.dataset.thickness || '0.15');
        if (thickness) {
            element.dataset.thickness = parseFloat(thickness);
        }
    }
}

function addResizeHandles(element) {
    const handles = ['left', 'right'];
    if (element.className === 'slab') handles.push('top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right');

    handles.forEach(direction => {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${direction}`;
        handle.dataset.direction = direction;
        element.appendChild(handle);
    });
}

function removeResizeHandles() {
    document.querySelectorAll('.resize-handle').forEach(handle => handle.remove());
}

function resizeElement(x, y) {
    const el = selectedElement;
    const left = parseFloat(el.style.left);
    const top = parseFloat(el.style.top);
    const width = parseFloat(el.style.width);
    const height = parseFloat(el.style.height) || 10; // Default for beams
    const dx = x - startPoint.x;
    const dy = y - startPoint.y;

    if (resizeMode === 'left') {
        const newWidth = width - dx;
        if (newWidth > 10) {
            el.style.left = (left + dx) + 'px';
            el.style.width = newWidth + 'px';
            updateElementData(el, newWidth / scale);
        }
    } else if (resizeMode === 'right') {
        const newWidth = width + dx;
        if (newWidth > 10) {
            el.style.width = newWidth + 'px';
            updateElementData(el, newWidth / scale);
        }
    } else if (resizeMode === 'top') {
        const newHeight = height - dy;
        if (newHeight > 10) {
            el.style.top = (top + dy) + 'px';
            el.style.height = newHeight + 'px';
            updateElementData(el, null, newHeight / scale);
        }
    } else if (resizeMode === 'bottom') {
        const newHeight = height + dy;
        if (newHeight > 10) {
            el.style.height = newHeight + 'px';
            updateElementData(el, null, newHeight / scale);
        }
    } else if (resizeMode === 'top-left') {
        const newWidth = width - dx;
        const newHeight = height - dy;
        if (newWidth > 10 && newHeight > 10) {
            el.style.left = (left + dx) + 'px';
            el.style.top = (top + dy) + 'px';
            el.style.width = newWidth + 'px';
            el.style.height = newHeight + 'px';
            updateElementData(el, newWidth / scale, newHeight / scale);
        }
    } else if (resizeMode === 'top-right') {
        const newWidth = width + dx;
        const newHeight = height - dy;
        if (newWidth > 10 && newHeight > 10) {
            el.style.top = (top + dy) + 'px';
            el.style.width = newWidth + 'px';
            el.style.height = newHeight + 'px';
            updateElementData(el, newWidth / scale, newHeight / scale);
        }
    } else if (resizeMode === 'bottom-left') {
        const newWidth = width - dx;
        const newHeight = height + dy;
        if (newWidth > 10 && newHeight > 10) {
            el.style.left = (left + dx) + 'px';
            el.style.width = newWidth + 'px';
            el.style.height = newHeight + 'px';
            updateElementData(el, newWidth / scale, newHeight / scale);
        }
    } else if (resizeMode === 'bottom-right') {
        const newWidth = width + dx;
        const newHeight = height + dy;
        if (newWidth > 10 && newHeight > 10) {
            el.style.width = newWidth + 'px';
            el.style.height = newHeight + 'px';
            updateElementData(el, newWidth / scale, newHeight / scale);
        }
    }
    startPoint = { x, y };
}

function updateElementData(element, length, width) {
    if (element.className === 'beam') element.dataset.length = length;
    else if (element.className === 'slab') {
        if (length) element.dataset.length = length;
        if (width) element.dataset.width = width;
    }
}

function updateTempElement(x, y) {
    const dx = x - startPoint.x;
    const dy = y - startPoint.y;
    const length = Math.abs(dx) / scale;
    const width = mode === 'slab' ? Math.abs(dy) / scale : 0;

    if (mode === 'beam') {
        tempElement.style.left = Math.min(startPoint.x, x) + 'px';
        tempElement.style.top = startPoint.y + 'px';
        tempElement.style.width = Math.abs(dx) + 'px';
        tempElement.style.height = '10px';
    } else if (mode === 'slab') {
        tempElement.style.left = Math.min(startPoint.x, x) + 'px';
        tempElement.style.top = Math.min(startPoint.y, y) + 'px';
        tempElement.style.width = Math.abs(dx) + 'px';
        tempElement.style.height = Math.abs(dy) + 'px';
    }

    dynamicLabel.style.left = (x + 10) + 'px';
    dynamicLabel.style.top = (y + 10) + 'px';
    dynamicLabel.textContent = mode === 'beam' ? `Length: ${length.toFixed(2)}m` : `L: ${length.toFixed(2)}m, W: ${width.toFixed(2)}m`;
    dynamicLabel.style.display = 'block';
}

function getSnapPoint(x, y, excludeElement) {
    let snapX = x;
    let snapY = y;
    elements.forEach(({ element }) => {
        if (element === excludeElement) return;
        const elLeft = parseFloat(element.style.left);
        const elTop = parseFloat(element.style.top);
        const elWidth = parseFloat(element.style.width) || 10;
        const elHeight = parseFloat(element.style.height) || 10;

        if (Math.abs(x - elLeft) < snapDistance) snapX = elLeft;
        else if (Math.abs(x - (elLeft + elWidth)) < snapDistance) snapX = elLeft + elWidth;
        if (Math.abs(y - elTop) < snapDistance) snapY = elTop;
        else if (Math.abs(y - (elTop + elHeight)) < snapDistance) snapY = elTop + elHeight;
    });
    return { x: snapX, y: snapY };
}
