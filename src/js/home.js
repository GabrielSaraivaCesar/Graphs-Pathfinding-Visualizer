import {generateDijkstraTable} from './libs/graph/algorithms/dijkstra.js';
import {findsmallerPath} from './libs/graph/algorithms/smaller_path.js';
import {findChinesePostmanPath} from './libs/graph/algorithms/chinese_postman.js';
import {NotReachablePathException, TooMuchIterations} from './libs/graph/algorithms/shared.js';
import {detectBridges} from './libs/graph/algorithms/bridges.js';

let isMenuCollapsed = false;
let stopsList = ["", ""];

const stopInputWrapper = document.querySelector(".path-input-list");
const menuCollapseToggle = document.querySelector('.menu-collapse-toggle');
const menu = document.querySelector('.menu');

function updateMenuCollapsedUIState() {
    if (isMenuCollapsed) {
        menuCollapseToggle.classList.add('collapsed');
        menu.classList.add('collapsed');
    } else {
        menuCollapseToggle.classList.remove('collapsed');
        menu.classList.remove('collapsed');
    }
}
updateMenuCollapsedUIState();

window.switchMenuCollapseState = function () {
    isMenuCollapsed = !isMenuCollapsed;
    updateMenuCollapsedUIState();
}

function updateVertexInputOptions() {
    let options = JSON.stringify(currentGraph.vertices.map(vertex => ({label: vertex.tag, value: vertex.tag})));
    let inputs = document.querySelectorAll(".path-input");
    inputs.forEach(input => {
      input.setAttribute("options", options);  
    })
}

window.generateChart = function () {
    let matrixSize = document.getElementById("matrix-size").value;
    currentGraph = generateNewScene(matrixSize);
    updateVertexInputOptions();
}

window.addStop = function () {
    extractVertexInputValues();
    stopsList.push("");
    renderStopList();
}

function extractVertexInputValues() {
    let inputs = document.querySelectorAll(".path-input");
    inputs.forEach((input, index) => {
        stopsList[index] = input.value;
    })
}

function renderStopList() {
    let result = "";
    stopsList.forEach((value, index) => {
        result += `
        <div style="z-index: ${stopsList.length-index};" class="stop-input-wrapper">
            <searchable-select-input value="${value}" class="path-input" label="${index===0?'Inicio':index===stopsList.length-1?'Final':'Parada ' + index}" options='[]'></searchable-select-input>
            ${ index > 0 && stopsList.length > 2 ? '<div class="stop-remove-btn" onclick="removeStop('+index+')"><i class="fa-solid fa-xmark"></i></div>' : ''}
        </div>
        ${index!==stopsList.length-1 ? '<vertical-spacing></vertical-spacing>' : ''}
        `;
    });
    stopInputWrapper.innerHTML = result;
    updateVertexInputOptions();
}

window.removeStop = function(index) {
    stopsList.splice(index, 1);
    renderStopList();
}

window.executeAlgorithm = async function () {
    window.clearPath();
    extractVertexInputValues();
    
    let algorithmChoice = document.querySelector("[name='algorithm-choice']:checked").value;

    let inputs = document.querySelectorAll(".path-input");
    let allInputsFilled = true;
    inputs.forEach((input, index) => {
        stopsList[index] = input.value; 
        if (input.value.trim() === '') {
            allInputsFilled = false;
        }
    })
    
   
    
    let path = {path: [], value: 0};
    if (algorithmChoice === "dijkstra") {
        if (!allInputsFilled) {
            showAlert("warning", "Preencha todas as paradas!");
            return
        }
        // if (!endVertex) {
        //     showAlert("warning", "Este algoritmo precisa de um vértice final!");
        //     return;
        // }
        // if (startVertex === endVertex) {
        //     showAlert("warning", "O vértice final precisa ser diferente do inicial!");
        //     return;
        // }

        try {
            for (let i = 0; i < stopsList.length-1; i++) {
                let startVertex = currentGraph.vertices.find(v => v.tag === stopsList[i]);
                let endVertex = currentGraph.vertices.find(v => v.tag === stopsList[i+1]);
                if (startVertex !== endVertex) {
                    let path_step = findsmallerPath(currentGraph, startVertex, endVertex);
                    path.path = [...path.path, ...path_step.path];
                    path.value += path_step.value;
                }
            }

            showAlert("success", "Caminho traçado!");
        } catch (err) {
            console.error(err);
            if (err instanceof NotReachablePathException) {
                showAlert("error", "Este caminho é inalcançável!");
            }
        }
    } else if (algorithmChoice === "chinese-postman") {
        try {
            let startVertex = currentGraph.vertices.find(v => v.tag === stopsList[0]);
            let endVertex = currentGraph.vertices.find(v => v.tag === stopsList[stopsList.length-1]);
            path = await findChinesePostmanPath(currentGraph, startVertex, endVertex);
            showAlert("success", "Caminho traçado!");
        } catch (err) {
            console.error(err);
            if (err instanceof NotReachablePathException) {
                showAlert("error", "Este grafo é inválido pois possúi multiplos componentes");
            } else if (err instanceof TooMuchIterations) {
                showAlert("error", "Este grafo possui muitos vertices de grau impar. Execução cancelada por segurança");
            }
        }
    }

    scene.resetAnimationFrame();
    drawPath("path-"+(stopsList[0] || "?")+"-"+(stopsList[stopsList.length-1] || "?"), path.path)
    drawPathAnimation("path-animation-"+(stopsList[0] || "?")+"-"+(stopsList[stopsList.length-1] || "?"), path.path);
    drawStopMarkers([...stopsList]);
    scene.draw();
    
}

window.clearPath = function() {
    scene.sceneObjects = scene.sceneObjects.filter(obj => {
        if (obj.tag.split("-")[0] === "path") {
            return false;
        }
        return true;
    });
    scene.draw();
}

function addSpacingBasedOnLineDestination(from, to) {
    const spacingFromCenter = 15;

    if (from.y === to.y && from.x < to.x) {
        from.y += spacingFromCenter;
        to.y += spacingFromCenter;
    } else if (from.y === to.y && from.x > to.x) {
        from.y -= spacingFromCenter;
        to.y -= spacingFromCenter;
    } else if (from.y > to.y && from.x === to.x) {
        from.x += spacingFromCenter;
        to.x += spacingFromCenter;
    } else if (from.y < to.y && from.x === to.x) {
        from.x -= spacingFromCenter;
        to.x -= spacingFromCenter;
    } else {
        if (from.y < to.y) {
            if (from.x < to.x) {
                from.y += spacingFromCenter;
                to.x -= spacingFromCenter;
            } else {
                from.x -= spacingFromCenter;
                to.y -= spacingFromCenter;
            }
        } else {
            if (from.x < to.x) {
                from.x += spacingFromCenter;
                to.y += spacingFromCenter;
            } else {
                from.y -= spacingFromCenter;
                to.x += spacingFromCenter;
            }
        }
    }
}

function drawStopMarkers(currentStopsList) {

    let algorithmChoice = document.querySelector("[name='algorithm-choice']:checked").value;

    scene.addObject("path-stop-markers", () => {
        currentStopsList.forEach((stopName, vertexIndex) => {
            if (algorithmChoice == "chinese-postman" && vertexIndex > 0) return;
            let vertex = currentGraph.vertices.find(v => v.tag === stopName);

            if (!vertex) return;
            
            let indicatorFrom = {
                x: vertex.posX,
                y: vertex.posY - 110
            }
            let indicatoTo = {
                x: vertex.posX,
                y: vertex.posY
            }
            if (vertexIndex === 0) {
                scene.context.strokeStyle = "#168c69";
                scene.context.fillStyle = "#168c69";
            } else if (vertexIndex === currentStopsList.length - 1) {
                scene.context.strokeStyle = "#DF190C";
                scene.context.fillStyle = "#DF190C";
            } else {
                scene.context.strokeStyle = "#fcba03";
                scene.context.fillStyle = "#fcba03";
            }
            drawArrowhead(scene.context, indicatorFrom, indicatoTo, 15);
        }) 
    })
}

function drawPathAnimation( name, path ) {
    if (path.length === 0) return;
    scene.addObject(name, () => {
        let animationFrameBySpeed = scene.animationFrame*2;

        if (animationFrameBySpeed > path.length - 1) {
            scene.resetAnimationFrame();
        }
        let pathIndex = parseInt(animationFrameBySpeed);
        let progress = animationFrameBySpeed - pathIndex;

        let startVertex = currentGraph.vertices.find(v => v.tag == path[pathIndex]);
        

        let pos = {
            x: startVertex.posX,
            y: startVertex.posY
        }
        if (pathIndex < path.length - 1) {
            let endVertex = currentGraph.vertices.find(v => v.tag == path[pathIndex+1]);
            let diffX = (endVertex.posX - startVertex.posX) * progress;
            pos.x += diffX;

            let diffY = (endVertex.posY - startVertex.posY) * progress;
            pos.y += diffY;
        }

        

        for (let i = 0; i < pathIndex; i++) {
            let currentV = currentGraph.vertices.find(v => v.tag == path[i]);

            let currentPos = {
                x: currentV.posX,
                y: currentV.posY
            }

            let nextV = currentGraph.vertices.find(v => v.tag == path[i+1]); 

            let nextPos = {
                x: nextV.posX,
                y: nextV.posY
            }

            scene.context.beginPath();
            scene.context.lineWidth = 7
            scene.context.strokeStyle = "#cfad38";
            scene.context.moveTo(currentPos.x, currentPos.y);
            scene.context.lineTo(nextPos.x, nextPos.y);
            scene.context.stroke();
            scene.context.closePath();

            scene.context.beginPath();
            scene.context.lineWidth = 5
            scene.context.strokeStyle = "#f5ce42";
            scene.context.moveTo(currentPos.x, currentPos.y);
            scene.context.lineTo(nextPos.x, nextPos.y);
            scene.context.stroke();
            scene.context.closePath();

            scene.context.beginPath();
            scene.context.lineWidth = 1
            scene.context.strokeStyle = "#f5ce42";
            scene.context.fillStyle = "#f5ce42";
            scene.context.arc(currentPos.x, currentPos.y, 3, 0, 2 * Math.PI);
            scene.context.stroke();
            scene.context.fill();
            scene.context.closePath();
        }
        
        scene.context.beginPath();
        scene.context.lineWidth = 3
        scene.context.strokeStyle = "#cfad38";
        scene.context.fillStyle = "#f5ce42";
        scene.context.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
        scene.context.stroke();
        scene.context.fill();
        scene.context.closePath();

        scene.context.beginPath();
        scene.context.lineWidth = 7
        scene.context.strokeStyle = "#cfad38";
        scene.context.moveTo(startVertex.posX, startVertex.posY);
        scene.context.lineTo(pos.x, pos.y);
        scene.context.stroke();
        scene.context.closePath();

        scene.context.beginPath();
        scene.context.lineWidth = 5
        scene.context.strokeStyle = "#f5ce42";
        scene.context.moveTo(startVertex.posX, startVertex.posY);
        scene.context.lineTo(pos.x, pos.y);
        scene.context.stroke();
        scene.context.closePath();

        scene.context.beginPath();
        scene.context.lineWidth = 1
        scene.context.strokeStyle = "#f5ce42";
        scene.context.fillStyle = "#f5ce42";
        scene.context.arc(startVertex.posX, startVertex.posY, 3, 0, 2 * Math.PI);
        scene.context.stroke();
        scene.context.fill();
        scene.context.closePath();
    });
}

function drawPath(name, path) {
    if (path.length === 0) return;
    scene.addObject(name, () => {
        let startVertexFromPath = currentGraph.vertices.find(v => v.tag == path[0])
        let lastPos = {
            x: startVertexFromPath.posX,
            y: startVertexFromPath.posY,
        }
        path.forEach((vertexTag, vertexIndex) => {
            let currentVertex = currentGraph.vertices.find(v => v.tag == vertexTag);

            let from = {
                x: lastPos.x,
                y: lastPos.y,
            }
            let to = {
                x: currentVertex.posX,
                y: currentVertex.posY
            }
            
            
            // addSpacingBasedOnLineDestination(from, to);

            scene.context.beginPath();
            // scene.context.lineWidth = 5
            // scene.context.strokeStyle = "#168c69";
            // scene.context.fillStyle = "#168c69";
            scene.context.lineWidth = 8
            scene.context.strokeStyle = "#cfad3855";
            scene.context.fillStyle = "#cfad3855";
            
            scene.context.moveTo(from.x, from.y);
            scene.context.lineTo(to.x, to.y);
            scene.context.stroke();
            scene.context.fill();
            scene.context.closePath();

            // drawArrowhead(scene.context, from, to, 5);
            lastPos.x = currentVertex.posX;
            lastPos.y = currentVertex.posY;
            scene.context.lineWidth = 5
            scene.context.stroke();
            scene.context.lineWidth = 1;

            
        })
    });
    reorderSceneObjects();
    scene.draw();
}

function reorderSceneObjects() {
    scene.sceneObjects = scene.sceneObjects.sort((objA, objB) => {
        let tagA = objA.tag.split("-")[0];
        let tagB = objB.tag.split("-")[0];
        
        if (tagA === "edge" && (tagB === "path" || tagB === "bridge" || tagB === "vertex")) return -1;
        if (tagA === "vertex" && (tagB === "edge" || tagB === "path" || tagB === "bridge")) return 1;


        if (tagB === "edge" && (tagA === "path" || tagA === "bridge" || tagA === "vertex")) return 1;
        if (tagB === "vertex" && (tagA === "edge" || tagA === "path" || tagA === "bridge")) return -1;

        return 0;
    });
}

window.drawBridges = function() {
    window.clearBridges();
    let bridges = detectBridges(currentGraph);
    bridges.forEach((bridge, index) => {
        scene.addObject('bridge-'+index, () => {
            scene.context.beginPath();
            scene.context.lineWidth = 5
            scene.context.strokeStyle = "#bd2b11";
            scene.context.moveTo(bridge.vertexA.posX, bridge.vertexA.posY);
            scene.context.lineTo(bridge.vertexB.posX, bridge.vertexB.posY);
            scene.context.stroke();
            scene.context.closePath();
        })
    });
    reorderSceneObjects();
    scene.draw();
}

window.clearBridges = function() {
    scene.sceneObjects = scene.sceneObjects.filter(obj => {
        if (obj.tag.split("-")[0] === "bridge") {
            return false;
        }
        return true;
    })
    scene.draw();
}

function enableAllInputs() {
    let inputs = document.querySelectorAll(".path-input");
    inputs.forEach(el => {
        el.removeAttribute("disabled");
    })
}

function disableNotInitialInputs() {
    
    let inputs = document.querySelectorAll(".path-input");
    inputs.forEach((el, i) => {
        if (i === 0) {
            el.removeAttribute("disabled");
        } else {
            el.setAttribute("disabled", "");
        }
    })
}

window.onSetChinesePostman = function(e) {
    disableNotInitialInputs();
}
window.onSetDijkstra = function(e) {
    enableAllInputs();
}


renderStopList();
updateVertexInputOptions();