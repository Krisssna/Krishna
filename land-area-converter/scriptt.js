class Geometry {
        static distance(p1, p2) { return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2); }
        static isPointOnLine(p, a, b, tolerance) { const L = this.distance(a, b); return this.distance(p, a) + this.distance(p, b) < L + tolerance; }
        static calculatePolygonArea(vertices) { if (vertices.length < 3) return 0; let area = 0; for (let i = 0; i < vertices.length; i++) { const p1 = vertices[i]; const p2 = vertices[(i + 1) % vertices.length]; area += p1.x * p2.y - p2.x * p1.y; } return Math.abs(area) / 2; }
        static getPolygonCentroid(vertices) { if(vertices.length === 0) return {x:0, y:0}; let cx = 0, cy = 0, a = 0; for (let i = 0; i < vertices.length; i++) { const p1 = vertices[i]; const p2 = vertices[(i + 1) % vertices.length]; const cross = p1.x * p2.y - p2.x * p1.y; a += cross; cx += (p1.x + p2.x) * cross; cy += (p1.y + p2.y) * cross; } const signedArea = a / 2; return signedArea === 0 ? vertices[0] : { x: cx / (6 * signedArea), y: cy / (6 * signedArea) }; }
        static lineSegmentIntersection(p1, q1, p2, q2, isInfiniteLine = false) { const r = { x: q1.x - p1.x, y: q1.y - p1.y }; const s = { x: q2.x - p2.x, y: q2.y - p2.y }; const rxs = r.x * s.y - r.y * s.x; if (Math.abs(rxs) < 1e-9) return null; const t = ((p2.x - p1.x) * s.y - (p2.y - p1.y) * s.x) / rxs; const u = ((p2.x - p1.x) * r.y - (p2.y - p1.y) * r.x) / rxs; if ((isInfiniteLine || (t >= 0 && t <= 1)) && (u >= 0 && u <= 1)) { return { x: p1.x + t * r.x, y: p1.y + t * r.y }; } return null; }
        static getOffsetLine(line, distance) { const [p1, p2] = line; const dx = p2.x - p1.x; const dy = p2.y - p1.y; const len = Math.sqrt(dx * dx + dy * dy); if (len === 0) return line; const normal = { x: -dy / len, y: dx / len }; return [{ x: p1.x + normal.x * distance, y: p1.y + normal.y * distance }, { x: p2.x + normal.x * distance, y: p2.y + normal.y * distance }]; }
        static findClosestPointOnSegment(p, a, b) { const ab = { x: b.x - a.x, y: b.y - a.y }; const ap = { x: p.x - a.x, y: p.y - a.y }; const lenSq = ab.x * ab.x + ab.y * ab.y; if (lenSq === 0) return a; const t = Math.max(0, Math.min(1, (ap.x * ab.x + ap.y * ab.y) / lenSq)); return { x: a.x + t * ab.x, y: a.y + t * ab.y }; }
        static isPointInPolygon(point, polygon) { let isInside = false; for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) { if (((polygon[i].y > point.y) !== (polygon[j].y > point.y)) && (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) { isInside = !isInside; }} return isInside; }
        static isValidDiagonal(startIdx, endIdx, n, diagonals) { if (startIdx === endIdx) return false; const s = Math.min(startIdx, endIdx); const e = Math.max(startIdx, endIdx); if (e - s <= 1 || e - s >= n - 1) return false; return !diagonals.some(d => d.startIdx === s && d.endIdx === e); }
    }

    class Slicer {
        constructor(plotter) { 
            this.plotter = plotter; 
            this.ui = { 
                panel: document.getElementById('slicer-panel'), 
                instructions: document.getElementById('slicer-instructions'), 
                areaInput: document.getElementById('slicer-area-input'), 
                cancelBtn: document.getElementById('slicer-cancel-btn'),
            }; 
            this.reset(); 
        }

        reset() { 
            this.isActive = false; 
            this.state = 'AWAITING_P1'; 
            this.p1 = null; 
            this.p2 = null; 
            this.targetArea = 0; 
            this.polygon = []; 
            this.finalParcels = null; 
            this.ui.panel.classList.add('hidden'); 
        }

        start(polygon) { 
            this.reset(); 
            this.isActive = true; 
            this.polygon = polygon; 
            this.totalArea = Geometry.calculatePolygonArea(this.polygon); 
            this.updateUI(); 
            this.ui.panel.classList.remove('hidden'); 
            this.ui.cancelBtn.onclick = () => this.plotter.setMode('OPTIMIZED'); 
            this.plotter.render(); 
        }

        handleMouseDown(pos) { 
            if (!this.isActive) return; 
            if (this.state === 'AWAITING_P1' || this.state === 'AWAITING_P2') { 
                this.handlePointSelection(pos); 
            } else if (this.state === 'AWAITING_CONFIRMATION') { 
                this.handleRegionConfirmation(pos); 
            } 
        }

        handlePointSelection(pos) { 
            let clickedSideInfo = null; 
            for (let i = 0; i < this.polygon.length; i++) { 
                const sideP1 = this.polygon[i]; 
                const sideP2 = this.polygon[(i + 1) % this.polygon.length]; 
                const closestPoint = Geometry.findClosestPointOnSegment(pos, sideP1, sideP2); 
                if (Geometry.distance(pos, closestPoint) < 5 / this.plotter.getPlotScaling().scale) { 
                    clickedSideInfo = { point: closestPoint, sideIndex: i }; 
                    break; 
                } 
            } 
            if (!clickedSideInfo) return; 
            
            if (this.state === 'AWAITING_P1') { 
                this.p1 = clickedSideInfo; 
                this.state = 'AWAITING_P2'; 
            } else if (this.p1 && clickedSideInfo.sideIndex !== this.p1.sideIndex) { 
                this.p2 = clickedSideInfo; 
                this.state = 'AWAITING_CONFIRMATION'; 
                this.ui.areaInput.focus();
            } 
            this.updateUI(); 
            this.plotter.render(); 
        }

        handleRegionConfirmation(pos) { 
            this.targetArea = parseFloat(this.ui.areaInput.value); 
            if(isNaN(this.targetArea) || this.targetArea <= 0 || this.targetArea >= this.totalArea) { 
                this.ui.areaInput.style.border = '1px solid var(--error-color)'; 
                return; 
            } 
            this.ui.areaInput.style.border = '1px solid #ccc'; 
            this.calculateFinalSlice(pos); 
        }

        /**
         * [PROFESSIONAL ALGORITHM v3 - FINAL]
         * This function uses a robust bisection search on the line offset.
         * It is stable and accurate for all valid target areas.
         */
        calculateFinalSlice(targetRegionPoint) {
            const initialLine = [this.p1.point, this.p2.point];
            const { min, max } = this.plotter.getPlotBoundingBox();
            const searchRange = Math.max(max.x - min.x, max.y - min.y) * 1.5;
            let low = -searchRange, high = searchRange, finalOffset = 0;

            // Step 1: Determine initial parcels and which one contains the target point
            const [initialA, initialB] = this.getPartitionsFromLine(initialLine);
            if (initialA.length < 3 || initialB.length < 3) {
                console.error("Invalid initial partitions");
                return;
            }

            const targetIsInA = Geometry.isPointInPolygon(targetRegionPoint, initialA);
            const initialArea = targetIsInA ? 
                Geometry.calculatePolygonArea(initialA) : 
                Geometry.calculatePolygonArea(initialB);

            // Step 2: Determine direction of area growth
            const testOffset = 0.01; // Small test offset
            const testLine = Geometry.getOffsetLine(initialLine, testOffset);
            const [testA, testB] = this.getPartitionsFromLine(testLine);
            
            let areaGrowsWithPositiveOffset;
            if (testA.length >= 3 && testB.length >= 3) {
                const testArea = targetIsInA ? 
                    Geometry.calculatePolygonArea(testA) : 
                    Geometry.calculatePolygonArea(testB);
                areaGrowsWithPositiveOffset = testArea > initialArea;
            } else {
                // Fallback: Assume positive offset increases area if target is on "right" side
                const lineVec = {
                    x: initialLine[1].x - initialLine[0].x,
                    y: initialLine[1].y - initialLine[0].y
                };
                const normalVec = { x: -lineVec.y, y: lineVec.x }; // Perpendicular vector
                const dotProduct = (targetRegionPoint.x - initialLine[0].x) * normalVec.x + 
                                 (targetRegionPoint.y - initialLine[0].y) * normalVec.y;
                areaGrowsWithPositiveOffset = dotProduct > 0;
            }

            // Step 3: Bisection search with robust error handling
            for (let i = 0; i < 64; i++) {
                const midOffset = (low + high) / 2;
                const offsetLine = Geometry.getOffsetLine(initialLine, midOffset);
                const [parcelA, parcelB] = this.getPartitionsFromLine(offsetLine);

                // Handle invalid partitions
                if (parcelA.length < 3 || parcelB.length < 3) {
                    if (areaGrowsWithPositiveOffset) {
                        high = midOffset;
                    } else {
                        low = midOffset;
                    }
                    continue;
                }

                // Determine which parcel contains the target point
                let currentParcel, currentArea;
                if (Geometry.isPointInPolygon(targetRegionPoint, parcelA)) {
                    currentParcel = parcelA;
                    currentArea = Geometry.calculatePolygonArea(parcelA);
                } else if (Geometry.isPointInPolygon(targetRegionPoint, parcelB)) {
                    currentParcel = parcelB;
                    currentArea = Geometry.calculatePolygonArea(parcelB);
                } else {
                    // Target point not in either parcel - adjust search range
                    if (areaGrowsWithPositiveOffset) {
                        high = midOffset;
                    } else {
                        low = midOffset;
                    }
                    continue;
                }

                const error = currentArea - this.targetArea;
                
                // Check for solution
                if (Math.abs(error) < 0.001) {
                    finalOffset = midOffset;
                    break;
                }

                // Adjust search bounds
                if ((error > 0) === areaGrowsWithPositiveOffset) {
                    high = midOffset;
                } else {
                    low = midOffset;
                }
                finalOffset = midOffset;
            }

            // Create final parcels
            const finalLine = Geometry.getOffsetLine(initialLine, finalOffset);
            const [finalA, finalB] = this.getPartitionsFromLine(finalLine);
            
            let selectedParcel, remainingParcel;
            if (Geometry.isPointInPolygon(targetRegionPoint, finalA)) {
                selectedParcel = finalA;
                remainingParcel = finalB;
            } else {
                selectedParcel = finalB;
                remainingParcel = finalA;
            }

            this.plotter.setMode('SLICED', { 
                selectedParcel, 
                remainingParcel, 
                finalLine 
            });
        }

        getPartitionsFromLine(line) { 
            const intersections = []; 
            for (let i = 0; i < this.polygon.length; i++) { 
                const p1 = this.polygon[i]; 
                const p2 = this.polygon[(i + 1) % this.polygon.length]; 
                const intersectPoint = Geometry.lineSegmentIntersection(line[0], line[1], p1, p2, true); 
                if (intersectPoint && !intersections.some(inter => Geometry.distance(inter.point, intersectPoint) < 1e-6)) { 
                    intersections.push({ point: intersectPoint, sideIndex: i }); 
                } 
            } 
            
            if(intersections.length < 2) return [[], []];
            
            intersections.sort((a,b) => a.sideIndex - b.sideIndex);
            let [i1, i2] = [intersections[0], intersections[intersections.length - 1]];
            
            const parcelA = [i1.point];
            for (let i = i1.sideIndex + 1; i <= i2.sideIndex; i++) parcelA.push(this.polygon[i]);
            parcelA.push(i2.point);
            
            const parcelB = [i2.point];
            for (let i = i2.sideIndex + 1; i < this.polygon.length; i++) parcelB.push(this.polygon[i]);
            for (let i = 0; i <= i1.sideIndex; i++) parcelB.push(this.polygon[i]);
            parcelB.push(i1.point);
            
            return [parcelA, parcelB]; 
        }

        updateUI() { 
            this.ui.areaInput.disabled = this.state !== 'AWAITING_CONFIRMATION'; 
            switch (this.state) { 
                case 'AWAITING_P1': 
                    this.ui.instructions.textContent = 'Step 1: Click a start point on any side.'; 
                    break; 
                case 'AWAITING_P2': 
                    this.ui.instructions.textContent = 'Step 2: Click an end point on a different side.'; 
                    break; 
                case 'AWAITING_CONFIRMATION': 
                    this.ui.instructions.textContent = 'Step 3: Enter area and click the desired region.'; 
                    break; 
            } 
        }

        render(ctx, scale) { 
            if (!this.isActive) return; 
            ctx.fillStyle = 'red'; 
            
            if (this.p1) { 
                ctx.beginPath(); 
                ctx.arc(this.p1.point.x, this.p1.point.y, 7 / scale, 0, 2 * Math.PI); 
                ctx.fill(); 
            } 
            
            if (this.p2) { 
                ctx.beginPath(); 
                ctx.arc(this.p2.point.x, this.p2.point.y, 7 / scale, 0, 2 * Math.PI); 
                ctx.fill(); 
                
                const [tempA, tempB] = this.getPartitionsFromLine([this.p1.point, this.p2.point]); 
                
                const drawPoly = (poly, color) => { 
                    if (poly.length < 3) return; 
                    ctx.fillStyle = color; 
                    ctx.beginPath(); 
                    ctx.moveTo(poly[0].x, poly[0].y); 
                    poly.forEach(v => ctx.lineTo(v.x, v.y)); 
                    ctx.closePath(); 
                    ctx.fill(); 
                }; 
                
                drawPoly(tempA, 'rgba(255, 165, 0, 0.4)'); 
                drawPoly(tempB, 'rgba(0, 128, 255, 0.4)'); 
            } 
        }
    }

     class InputController {
        constructor() {
            this.modal = document.getElementById('centered-modal');
            this.modalTitle = document.getElementById('modal-title');
            this.modalSubtitle = document.getElementById('modal-subtitle');
            this.modalInput = document.getElementById('modal-input');
            this.modalCancelBtn = document.getElementById('modal-cancel-btn');
            this.modalSubmitBtn = document.getElementById('modal-submit-btn');
            
            this.inlineBox = document.getElementById('inline-input-box');
            this.inlineInput = document.getElementById('inline-input');
            
            this.activeInput = null;
            this.onSubmit = null;
            this.onCancel = null;
            this.ignoreBlur = false;
        }

        prompt({ title, subtitle, placeholder, validationFn, coords }) {
            return new Promise((resolve, reject) => {
                this.onSubmit = (value) => {
                    if (validationFn(value)) {
                        this.hide();
                        resolve(value);
                    } else {
                        this.activeInput.style.border = '1px solid var(--error-color)';
                    }
                };
                
                 this.onCancel = () => {
                    this.hide();
                    reject(new Error("User canceled input."));
                };
                
                if (coords) {
                    this.activeInput = this.inlineInput;
                    this.inlineBox.style.left = `${coords.x}px`;
                    this.inlineBox.style.top = `${coords.y}px`;
                    this.inlineInput.placeholder = placeholder || '';
                    this.inlineBox.classList.remove('hidden');
                    
                    this.ignoreBlur = true;
                    setTimeout(() => {
                        this.ignoreBlur = false;
                        this.activeInput.focus();
                    }, 100);
                } else { 
		            this.activeInput = this.modalInput;
                    this.modalTitle.textContent = title;
                    this.modalSubtitle.textContent = subtitle || '';
                    this.modalInput.placeholder = placeholder || '';
                    this.modal.classList.remove('hidden');
                    this.activeInput.focus();
                }
                
                this.activeInput.value = '';
                this.activeInput.style.border = '1px solid #ccc';
                
                const handleKeyDown = (e) => {
                    if (e.key === 'Enter') this.submit();
                    if (e.key === 'Escape') this.cancel();
                };
                
                const handleBlur = () => {
                    if (!this.ignoreBlur) {
                        setTimeout(() => {
                            if (document.activeElement !== this.activeInput) {
                                // On blur (click outside), SUBMIT the value instead of canceling
                                this.submit();
                            }
                        }, 100);
                    }
                };
                
                this.activeInput.onkeydown = handleKeyDown;
                this.activeInput.onblur = handleBlur;
            });
        }

        submit() {
            const value = this.activeInput.value;
            if (this.onSubmit) this.onSubmit(value);
        }

        cancel() {
            if (this.onCancel) this.onCancel();
        }

        hide() {
            this.modal.classList.add('hidden');
            this.inlineBox.classList.add('hidden');
            if (this.activeInput) {
                this.activeInput.onkeydown = null;
                this.activeInput.onblur = null;
                this.activeInput = null;
            }
            this.ignoreBlur = false;
        }
    }


    class LandPlotter {
        constructor() {
            this.canvas = document.getElementById('plot-canvas');
            this.ctx = this.canvas.getContext('2d');
            
            this.ui = {
                unitSelector: document.getElementById('unit-selector'),
                optimizeBtn: document.getElementById('optimize-btn'),
                sliceBtn: document.getElementById('slice-btn'),
                calculateBtn: document.getElementById('calculate-btn'),
                resetBtn: document.getElementById('reset-btn'),
                undoBtn: document.getElementById('undo-btn'),
                infoBar: document.getElementById('info-bar'),
                resultsDiv: document.getElementById('results'),
                mainControls: document.getElementById('main-controls'),
            };
            
            this.slicer = new Slicer(this);
            this.inputController = new InputController();
            this.state = {};
            this.history = [];
            
            this.adjustCanvasSize();
            this.reset();
            this.bindEventListeners();
        }

        adjustCanvasSize() { 
            const container = this.canvas.parentElement; 
            const width = container.clientWidth; 
            const height = width * (3 / 4); 
            this.canvas.style.width = width + 'px'; 
            this.canvas.style.height = height + 'px'; 
            this.canvas.width = width; 
            this.canvas.height = height; 
            if (this.state && this.state.mode) this.render(); 
        }

        bindEventListeners() { 
            window.addEventListener('resize', () => this.adjustCanvasSize()); 
            this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this)); 
            this.ui.resetBtn.addEventListener('click', this.reset.bind(this)); 
            this.ui.undoBtn.addEventListener('click', this.undo.bind(this));
            this.ui.optimizeBtn.addEventListener('click', this.startOptimization.bind(this)); 
            this.ui.calculateBtn.addEventListener('click', this.calculateAndShowArea.bind(this)); 
            this.ui.sliceBtn.addEventListener('click', () => this.setMode('SLICING')); 
            this.ui.unitSelector.addEventListener('change', () => { 
                this.state.unit = this.ui.unitSelector.value; 
                this.render(); 
            }); 
        }

        reset() { 
            this.state = { 
                mode: 'DRAW_POLY', 
                vertices: [], 
                isClosed: false, 
                dimensions: {}, 
                diagonals: [], 
                diagonalDimensions: {}, 
                optimizedVertices: [], 
                unit: this.ui.unitSelector.value, 
                tempDiagonalStart: null, 
                finalParcels: null 
            }; 
            this.history = [];
            this.slicer.reset(); 
            this.inputController.hide(); 
            this.updateUI(); 
            this.render(); 
        }

        saveStateForUndo() {
            this.history.push(JSON.parse(JSON.stringify(this.state)));
            this.updateUI();
        }

        undo() {
            if (this.history.length > 0) {
                this.state = this.history.pop();
                // If we undo out of slicing mode, ensure slicer panel is correctly reset
                if (this.state.mode !== 'SLICING') {
                    this.slicer.reset(); 
                }
                this.updateUI();
                this.render();
            }
        }

        setMode(mode, data = null) { 
            // Save state before entering slicing mode for the first time
            if (mode === 'SLICING' && this.state.mode !== 'SLICING') {
                this.saveStateForUndo();
            }

            this.state.mode = mode; 
            if (mode !== 'SLICING') {
                this.slicer.reset(); 
            }
            
            if (mode === 'SLICING') { 
                this.state.finalParcels = null; 
                this.slicer.start(this.state.optimizedVertices); 
            } else if (mode === 'SLICED') { 
                this.state.finalParcels = data; 
                this.displaySlicedResults(); 
            } 
            
            this.updateUI(); 
            this.render(); 
        }

        handleMouseDown(e) {
            if (document.activeElement.id === 'inline-input') return; 
            this.inputController.hide();
            
            const rect = this.canvas.getBoundingClientRect();
            const uiPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            const geoPos = this.getMousePos(e);
            
            switch (this.state.mode) {
                case 'DRAW_POLY': 
                    this.handleDrawPoly(geoPos); 
                    break;
                case 'DIMENSION_SIDES': 
                    this.handleClickToDimension(geoPos, 'side', uiPos); 
                    break;
                case 'DRAW_DIAGONALS': 
                    this.handleClickToDimension(geoPos, 'diagonal', uiPos); 
                    this.handleClickToDrawDiagonal(geoPos); 
                    break;
                case 'SLICING': 
                    this.slicer.handleMouseDown(geoPos); 
                    break;
            }
        }

        handleDrawPoly(pos) { 
            this.saveStateForUndo();
            if (this.state.vertices.length > 2 && Geometry.distance(pos, this.state.vertices[0]) < 15) { 
                this.state.isClosed = true; 
                this.state.mode = 'DIMENSION_SIDES'; 
            } else { 
                this.state.vertices.push(pos); 
            } 
            this.updateUI(); 
            this.render(); 
        }

          handleClickToDimension(geoPos, type, uiPos) {
            this.inputController.hide();
            
            const vertices = this.state.optimizedVertices.length > 0 ? 
                         this.state.optimizedVertices : this.state.vertices;
            
            const lines = [];
            if (type === 'side') {
                for (let i = 0; i < vertices.length; i++) {
                    const p1 = vertices[i];
                    const p2 = vertices[(i + 1) % vertices.length];
                    lines.push({
                        p1, p2,
                        key: `v${i}-v${(i + 1) % vertices.length}`,
                        index: i
                    });
                }
            } else {
                this.state.diagonals.forEach(d => {
                    lines.push({
                        p1: vertices[d.startIdx],
                        p2: vertices[d.endIdx],
                        key: `d${d.startIdx}-d${d.endIdx}`,
                        index: d.startIdx
                    });
                });
            }

           for (const line of lines) {
                const closestPoint = Geometry.findClosestPointOnSegment(geoPos, line.p1, line.p2);
                const distance = Geometry.distance(geoPos, closestPoint);
                const tolerance = 10 / (this.state.optimizedVertices.length > 0 ? 
                                     this.getPlotScaling().scale : 1);
                
                if (distance < tolerance) {
                    const midX = (line.p1.x + line.p2.x) / 2;
                    const midY = (line.p1.y + line.p2.y) / 2;
                    const scaledPos = this.getScaledPosition(midX, midY);
                    
                    this.promptForDimension(line.key, type, {
                        x: scaledPos.x,
                        y: scaledPos.y
                    });
                    return;
                }
            }
        }

getScaledPosition(x, y) {
            if (this.state.optimizedVertices.length > 0) {
                const { scale, offsetX, offsetY } = this.getPlotScaling();
                return {
                    x: x * scale + offsetX,
                    y: y * scale + offsetY
                };
            }
            return { x, y };
        }


        handleClickToDrawDiagonal(pos) { 
            this.saveStateForUndo();
            const clickedVertexIdx = this.state.vertices.findIndex(v => Geometry.distance(pos, v) < 15); 
            if (clickedVertexIdx === -1) return; 
            
            if (this.state.tempDiagonalStart === null) { 
                this.state.tempDiagonalStart = clickedVertexIdx; 
            } else { 
                if (Geometry.isValidDiagonal(this.state.tempDiagonalStart, clickedVertexIdx, this.state.vertices.length, this.state.diagonals)) { 
                    this.state.diagonals.push({ 
                        startIdx: Math.min(this.state.tempDiagonalStart, clickedVertexIdx), 
                        endIdx: Math.max(this.state.tempDiagonalStart, clickedVertexIdx) 
                    }); 
                } 
                this.state.tempDiagonalStart = null; 
            } 
            this.updateUI(); 
            this.render(); 
        }

        async promptForDimension(key, type, coords) { 
            this.saveStateForUndo();
            try { 
                const value = await this.inputController.prompt({ 
                    coords, 
                    placeholder: this.state.unit === 'meters' ? 'e.g., 50.5' : 'e.g., 120-6.5', 
                    validationFn: (val) => val && !isNaN(this.parseLength(val)) 
                }); 
                
                const meters = this.parseLength(value); 
                if (meters > 0) { 
                    if (type === 'side') this.state.dimensions[key] = meters; 
                    else this.state.diagonalDimensions[key] = meters; 
                    this.checkAndAdvanceState(); 
                } 
            } catch (err) { 
                this.undo(); // Revert the state save if user cancels
            } 
            this.updateUI(); 
            this.render(); 
        }

        parseLength(value) { 
            if (this.state.unit === 'meters') return parseFloat(value); 
            const parts = value.match(/(\d+\.?\d*)/g); 
            if (!parts) return NaN; 
            const feet = parseFloat(parts[0]) || 0; 
            const inches = parseFloat(parts[1]) || 0; 
            return (feet * 12 + inches) * 0.0254; 
        }

        checkAndAdvanceState() { 
            if (this.state.mode === 'DIMENSION_SIDES' && Object.keys(this.state.dimensions).length >= this.state.vertices.length) { 
                this.state.mode = 'DRAW_DIAGONALS'; 
            } 
            this.updateUI(); 
        }

        async startOptimization() { 
            this.saveStateForUndo();
            try { 
                const baseSideStr = await this.inputController.prompt({ 
                    title: 'Set Base Side', 
                    subtitle: 'Enter side to place on X-axis (e.g., "0-1")', 
                    placeholder: '0-1', 
                    validationFn: (val) => /^\d+-\d+$/.test(val) 
                }); 
                
                const [startIdx, endIdx] = baseSideStr.split('-').map(Number); 
                const key = `v${startIdx}-v${endIdx}`, revKey = `v${endIdx}-v${startIdx}`; 
                
                if (!isNaN(startIdx) && !isNaN(endIdx) && (this.state.dimensions[key] || this.state.dimensions[revKey])) { 
                    this.optimizePlot({ startIdx, endIdx }); 
                } else { 
                    this.inputController.submit(); 
                } 
            } catch (err) { 
                this.undo(); // Revert the state save if user cancels
            } 
        }

        optimizePlot(baseSide) { 
            const n = this.state.vertices.length; 
            
            const getLength = (idx1, idx2) => { 
                const sKey = `v${idx1}-v${idx2}`, rKey = `v${idx2}-v${idx1}`; 
                if (this.state.dimensions[sKey] || this.state.dimensions[rKey]) 
                    return this.state.dimensions[sKey] || this.state.dimensions[rKey]; 
                const dKey = `d${Math.min(idx1, idx2)}-d${Math.max(idx1, idx2)}`; 
                return this.state.diagonalDimensions[dKey]; 
            }; 
            
            const newVertices = new Array(n).fill(null); 
            const baseLength = getLength(baseSide.startIdx, baseSide.endIdx); 
            newVertices[baseSide.startIdx] = { x: 0, y: 0 }; 
            newVertices[baseSide.endIdx] = { x: baseLength, y: 0 }; 
            
            const placed = new Array(n).fill(false); 
            placed[baseSide.startIdx] = true; 
            placed[baseSide.endIdx] = true; 
            
            let changedInLoop = true; 
            let iterations = 0; 
            
            while (placed.includes(false) && changedInLoop && iterations < n * 2) { 
                changedInLoop = false; 
                iterations++; 
                
                for (let i = 0; i < n; i++) { 
                    if (placed[i]) continue; 
                    
                    const anchors = []; 
                    for (let j = 0; j < n; j++) { 
                        if (placed[j] && getLength(i, j)) anchors.push(j); 
                    } 
                    
                    if (anchors.length >= 2) { 
                        const p1_idx = anchors[0], p2_idx = anchors[1]; 
                        const p1 = newVertices[p1_idx], p2 = newVertices[p2_idx]; 
                        const d1 = getLength(i, p1_idx), d2 = getLength(i, p2_idx), d3 = Geometry.distance(p1, p2); 
                        
                        if (d1 + d2 < d3 - 1e-6 || d1 + d3 < d2 - 1e-6 || d2 + d3 < d1 - 1e-6) { 
                            alert(`Error: Triangle inequality violated for vertex ${i}. Check dimensions.`); 
                            return; 
                        } 
                        
                        const cosAngle = (d1 * d1 + d3 * d3 - d2 * d2) / (2 * d1 * d3); 
                        const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle))); 
                        const baseAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x); 
                        
                        const vOrig = { 
                            x: this.state.vertices[i].x - this.state.vertices[p1_idx].x, 
                            y: this.state.vertices[i].y - this.state.vertices[p1_idx].y 
                        }; 
                        
                        const baseOrig = { 
                            x: this.state.vertices[p2_idx].x - this.state.vertices[p1_idx].x, 
                            y: this.state.vertices[p2_idx].y - this.state.vertices[p1_idx].y 
                        }; 
                        
                        const crossProduct = vOrig.x * baseOrig.y - vOrig.y * baseOrig.x; 
                        const finalAngle = baseAngle + (crossProduct >= 0 ? -angle : angle); 
                        
                        newVertices[i] = { 
                            x: p1.x + d1 * Math.cos(finalAngle), 
                            y: p1.y + d1 * Math.sin(finalAngle) 
                        }; 
                        
                        placed[i] = true; 
                        changedInLoop = true; 
                    } 
                } 
            } 
            
            if (placed.includes(false)) { 
                alert("Optimization failed. The plot may be over- or under-constrained."); 
                return; 
            } 
            
            this.state.optimizedVertices = newVertices; 
            this.setMode('OPTIMIZED'); 
        }

        convertToRAPD(sqFt) { 
            const DAM_SQFT = 21.390625; 
            let totalDam = sqFt / DAM_SQFT; 
            const dam = totalDam % 4; 
            let totalPaisa = Math.floor(totalDam / 4); 
            const paisa = totalPaisa % 4; 
            let totalAana = Math.floor(totalPaisa / 4); 
            const aana = totalAana % 16; 
            const ropani = Math.floor(totalAana / 16); 
            return `${ropani}-${aana}-${paisa}-${dam.toFixed(2)}`; 
        }

        convertToBKD(sqFt) { 
            const DHUR_SQFT = 182.25; 
            let totalDhur = sqFt / DHUR_SQFT; 
            const dhur = totalDhur % 20; 
            let totalKaththa = Math.floor(totalDhur / 20); 
            const kaththa = totalKaththa % 20; 
            const bigha = Math.floor(totalKaththa / 20); 
            return `${bigha}-${kaththa}-${dhur.toFixed(2)}`; 
        }

        formatArea(areaM2) { 
            const areaSqFt = areaM2 * 10.7639; 
            const rapd = this.convertToRAPD(areaSqFt); 
            const bkd = this.convertToBKD(areaSqFt); 
            return `<strong>${areaM2.toFixed(2)}</strong> m² / <strong>${areaSqFt.toFixed(2)}</strong> ft²<br>R-A-P-D: <strong>${rapd}</strong><br>B-K-D: <strong>${bkd}</strong>`; 
        }

        calculateAndShowArea() { 
            const totalArea = Geometry.calculatePolygonArea(this.state.optimizedVertices); 
            this.ui.resultsDiv.innerHTML = `<strong>Total Area:</strong><br>${this.formatArea(totalArea)}`; 
            this.ui.resultsDiv.classList.remove('hidden'); 
        }

        displaySlicedResults() { 
            const { selectedParcel, remainingParcel } = this.state.finalParcels; 
            const areaA = Geometry.calculatePolygonArea(selectedParcel); 
            const areaB = Geometry.calculatePolygonArea(remainingParcel); 
            this.ui.resultsDiv.innerHTML = `<strong>Selected Parcel:</strong><br>${this.formatArea(areaA)}<hr style="border:0; border-top: 1px solid #ccc; margin: 0.5rem 0;"><strong>Remaining Parcel:</strong><br>${this.formatArea(areaB)}`; 
            this.ui.resultsDiv.classList.remove('hidden'); 
        }

        updateUI() { 
            const n = this.state.vertices.length; 
            const reqDiags = n > 2 ? n - 3 : 0; 
            const sidesDone = n > 0 && Object.keys(this.state.dimensions).length >= n; 
            const diagsDone = n > 0 && this.state.diagonals.length === reqDiags && Object.keys(this.state.diagonalDimensions).length >= reqDiags; 
            
            this.ui.undoBtn.disabled = this.history.length === 0;
            this.ui.optimizeBtn.disabled = !(sidesDone && diagsDone) || this.state.optimizedVertices.length > 0; 
            const isOptimized = this.state.optimizedVertices.length > 0; 
            this.ui.calculateBtn.disabled = !isOptimized; 
            this.ui.sliceBtn.disabled = !isOptimized || this.state.mode === 'SLICED'; 
            
            if (this.state.mode !== 'SLICED') { 
                this.ui.resultsDiv.classList.add('hidden'); 
            } 
            
            this.slicer.ui.panel.classList.toggle('hidden', this.state.mode !== 'SLICING'); 
            
            let infoText = ''; 
            switch(this.state.mode) { 
                case 'DRAW_POLY': 
                    infoText = '<strong>Step 1:</strong> Draw the plot. Click near start to close.'; 
                    break; 
                case 'DIMENSION_SIDES': 
                    infoText = '<strong>Step 2:</strong> Click each side to enter its length.'; 
                    break; 
                case 'DRAW_DIAGONALS': 
                    infoText = `<strong>Step 3:</strong> Draw & dimension <strong>${reqDiags - this.state.diagonals.length}</strong> more diagonal(s).`; 
                    break; 
                case 'OPTIMIZED': 
                    infoText = '✅ <strong>Plot Optimized!</strong> Ready to Slice or Calculate Area.'; 
                    break; 
                case 'SLICING': 
                    infoText = '🔪 <strong>Slicing Mode:</strong> Follow instructions in the panel. Mark expected area less than required '; 
                    break; 
                case 'SLICED': 
                    infoText = '✨ <strong>Partition Complete!</strong> New parcel dimensions are shown.'; 
                    break; 
            } 
            this.ui.infoBar.innerHTML = infoText; 
        }

        render() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            const { mode } = this.state;
            const isOptimizedOrSliced = ['OPTIMIZED', 'SLICING', 'SLICED'].includes(mode);
            
            if (isOptimizedOrSliced) {
                const { scale, offsetX, offsetY } = this.getPlotScaling();
                this.ctx.save(); 
                this.ctx.translate(offsetX, offsetY); 
                this.ctx.scale(scale, scale);
                
                if (mode === 'OPTIMIZED') { 
                    this.renderOptimizedPlot(scale); 
                    this.renderDiagonals(scale); 
                    this.renderAllDimensions(this.state.optimizedVertices, scale); 
                } 
                else if (mode === 'SLICING') { 
                    this.renderOptimizedPlot(scale); 
                    this.slicer.render(this.ctx, scale); 
                } 
                else if (mode === 'SLICED') { 
                    this.renderFinalParcels(scale); 
                    this.renderParcelDimensions(this.state.finalParcels.selectedParcel, scale, '#005a9c'); 
                    this.renderParcelDimensions(this.state.finalParcels.remainingParcel, scale, '#b36b00'); 
                }
                
                this.ctx.restore();
            } else { 
                this.renderInitialSketch(); 
            }
        }

        renderInitialSketch() { 
            if (this.state.vertices.length === 0) return; 
            const { vertices, tempDiagonalStart } = this.state; 
            const ctx = this.ctx; 
            
            this.renderDiagonals(); 
            this.renderAllDimensions(vertices); 
            
            ctx.strokeStyle = '#333'; 
            ctx.lineWidth = 2; 
            ctx.beginPath(); 
            ctx.moveTo(vertices[0].x, vertices[0].y); 
            vertices.forEach((v, i) => i > 0 && ctx.lineTo(v.x, v.y)); 
            if (this.state.isClosed) ctx.closePath(); 
            ctx.stroke(); 
            
            vertices.forEach((v, i) => { 
                ctx.fillStyle = tempDiagonalStart === i ? 'var(--accent-color)' : 'var(--primary-color)'; 
                ctx.beginPath(); 
                ctx.arc(v.x, v.y, 6, 0, 2 * Math.PI); 
                ctx.fill(); 
                ctx.fillStyle = 'var(--error-color)'; 
                ctx.font = 'bold 14px Arial'; 
                ctx.fillText(i, v.x + 10, v.y - 10); 
            }); 
        }

        formatLength(meters) { 
            if (this.state.unit === 'meters') return `${meters.toFixed(2)} m`; 
            const totalInches = meters / 0.0254; 
            const feet = Math.floor(totalInches / 12); 
            const inches = totalInches % 12; 
            return `${feet}' ${inches.toFixed(1)}"`; 
        }

        drawLabel(p1, p2, label, scale, color) { 
            const mid = {x: (p1.x + p2.x)/2, y: (p1.y + p2.y)/2}; 
            this.ctx.save(); 
            this.ctx.translate(mid.x, mid.y); 
            let angle = Math.atan2(p2.y - p1.y, p2.x - p1.x); 
            if (angle < -Math.PI / 2 || angle > Math.PI / 2) { 
                angle += Math.PI; 
            } 
            this.ctx.rotate(angle); 
            this.ctx.textAlign = 'center'; 
            this.ctx.fillStyle = color; 
            this.ctx.fillText(label, 0, -8 / scale); 
            this.ctx.restore(); 
        }

        renderAllDimensions(vertices, scale = 1) { 
            if (vertices.length === 0) return; 
            this.ctx.font = `bold ${13 / scale}px Arial`; 
            
            for(const key in this.state.dimensions) { 
                const [v1, v2] = key.substring(1).split('-v').map(Number); 
                if(v1 < vertices.length && v2 < vertices.length) 
                    this.drawLabel(vertices[v1], vertices[v2], this.formatLength(this.state.dimensions[key]), scale, 'var(--primary-color)'); 
            } 
            
            for(const key in this.state.diagonalDimensions) { 
                const [d1, d2] = key.substring(1).split('-d').map(Number); 
                if(d1 < vertices.length && d2 < vertices.length) 
                    this.drawLabel(vertices[d1], vertices[d2], this.formatLength(this.state.diagonalDimensions[key]), scale, 'var(--success-color)'); 
            } 
        }

        renderParcelDimensions(parcel, scale, color) { 
            if (parcel.length < 2) return; 
            this.ctx.font = `bold ${13 / scale}px Arial`; 
            for (let i = 0; i < parcel.length; i++) { 
                const p1 = parcel[i]; 
                const p2 = parcel[(i + 1) % parcel.length]; 
                const distance = Geometry.distance(p1, p2); 
                if (distance < 0.1) continue; 
                const label = this.formatLength(distance); 
                this.drawLabel(p1, p2, label, scale, color); 
            } 
        }

        renderOptimizedPlot(scale) { 
            const verts = this.state.optimizedVertices; 
            this.ctx.strokeStyle = this.state.mode === 'SLICING' ? 'rgba(0,0,0,0.2)' : '#333'; 
            this.ctx.lineWidth = 2 / scale; 
            this.ctx.beginPath(); 
            this.ctx.moveTo(verts[0].x, verts[0].y); 
            verts.forEach(v => this.ctx.lineTo(v.x, v.y)); 
            this.ctx.closePath(); 
            this.ctx.stroke(); 
        }

        renderDiagonals(scale = 1) { 
            const verts = this.state.optimizedVertices.length > 0 ? this.state.optimizedVertices : this.state.vertices; 
            if (verts.length === 0) return; 
            
            this.ctx.strokeStyle = '#aaa'; 
            this.ctx.lineWidth = 1 / scale; 
            this.ctx.setLineDash([5, 5]); 
            
            this.state.diagonals.forEach(d => { 
                this.ctx.beginPath(); 
                this.ctx.moveTo(verts[d.startIdx].x, verts[d.startIdx].y); 
                this.ctx.lineTo(verts[d.endIdx].x, verts[d.endIdx].y); 
                this.ctx.stroke(); 
            }); 
            
            this.ctx.setLineDash([]); 
        }

        renderFinalParcels(scale) { 
            const { selectedParcel, remainingParcel, finalLine } = this.state.finalParcels; 
            
            const drawPoly = (poly, color) => { 
                if(poly.length < 3) return; 
                this.ctx.fillStyle = color; 
                this.ctx.beginPath(); 
                this.ctx.moveTo(poly[0].x, poly[0].y); 
                poly.slice(1).forEach(v => this.ctx.lineTo(v.x, v.y)); 
                this.ctx.closePath(); 
                this.ctx.fill(); 
            }; 
            
            drawPoly(selectedParcel, 'rgba(0, 150, 136, 0.6)'); 
            drawPoly(remainingParcel, 'rgba(255, 193, 7, 0.6)'); 
            
            this.ctx.strokeStyle = 'red'; 
            this.ctx.lineWidth = 3 / scale; 
            this.ctx.beginPath(); 
            this.ctx.moveTo(finalLine[0].x, finalLine[0].y); 
            this.ctx.lineTo(finalLine[1].x, finalLine[1].y); 
            this.ctx.stroke(); 
            
            const centerA = Geometry.getPolygonCentroid(selectedParcel); 
            const centerB = Geometry.getPolygonCentroid(remainingParcel); 
            this.ctx.fillStyle = 'black'; 
            this.ctx.font = `bold ${20 / scale}px Arial`; 
            this.ctx.textAlign = 'center'; 
            this.ctx.fillText(`Selected`, centerA.x, centerA.y); 
            this.ctx.fillText(`Remaining`, centerB.x, centerB.y); 
        }

        getMousePos(evt) {
            const rect = this.canvas.getBoundingClientRect();
            const x = (evt.clientX - rect.left) * (this.canvas.width / rect.width);
            const y = (evt.clientY - rect.top) * (this.canvas.height / rect.height);
            
            if (this.state.optimizedVertices.length > 0) {
                const { scale, offsetX, offsetY } = this.getPlotScaling();
                return { 
                    x: (x - offsetX) / scale, 
                    y: (y - offsetY) / scale 
                };
            }
            return { x, y };
        }

        getPlotBoundingBox() { 
            const verts = this.state.optimizedVertices.length > 0 ? this.state.optimizedVertices : this.state.vertices; 
            if (verts.length === 0) return { min: {x:0, y:0}, max: {x:0, y:0} }; 
            
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity; 
            verts.forEach(v => { 
                minX = Math.min(minX, v.x); 
                minY = Math.min(minY, v.y); 
                maxX = Math.max(maxX, v.x); 
                maxY = Math.max(maxY, v.y); 
            }); 
            
            return { min: {x:minX, y:minY}, max: {x:maxX, y:maxY} }; 
        }

        getPlotScaling() { 
            const {min, max} = this.getPlotBoundingBox(); 
            const padding = 60; 
            const plotWidth = max.x - min.x; 
            const plotHeight = max.y - min.y; 
            
            if(plotWidth === 0 || plotHeight === 0) return { scale: 1, offsetX: 0, offsetY: 0 }; 
            
            const scale = Math.min(
                (this.canvas.width - padding) / plotWidth, 
                (this.canvas.height - padding) / plotHeight
            ); 
            
            const offsetX = (this.canvas.width - plotWidth * scale) / 2 - min.x * scale; 
            const offsetY = (this.canvas.height - plotHeight * scale) / 2 - min.y * scale; 
            
            return { scale, offsetX, offsetY }; 
        }
    }
    
     document.addEventListener('DOMContentLoaded', () => new LandPlotter());
    
