
function generateNewScene(matrixSize=4) {
    scene.clearScene();

    let WCFMatrix = generateWCFMatrix(matrixSize);
    let graph = new Graph();
    let directed = false;

    WCFMatrix.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (col && col.isVertex) {
                let vertex = new GraphVertex("v"+rowIndex+"-"+colIndex);
                vertex.posX = colIndex * vertexSpacing;
                vertex.posY = rowIndex * vertexSpacing;
                col.vertex = vertex
                graph.vertices.push(vertex)
            }
        })  
    })

    WCFMatrix.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (col && col.isVertex ) {
                linkEdges(row, rowIndex, col, colIndex, graph, WCFMatrix, directed);
            }
        })  
    })

    // Drawing phase
    graph.edges.forEach(edge => {
        let paralelsList = graph.edges.filter((e) => {
            return (e.vertexA == edge.vertexA && e.vertexB == edge.vertexB) || (e.vertexB == edge.vertexA && e.vertexA == edge.vertexB);
        })
        scene.addObject("edge-"+edge.vertexA.tag+"-"+edge.vertexB.tag, () => {
            drawEdge(edge, paralelsList.length > 1);
        })
    });

    graph.vertices.forEach(vertex => {
        scene.addObject("vertex-"+vertex.tag, () => {
            drawVertex(vertex);
        })
    });

    scene.draw()
    return graph;
}

function linkEdges(row, rowIndex, col, colIndex, graph, WCFMatrix, directed=false) {
    let edgeValue = Math.floor(Math.random() * (maxEdgeValue - minEdgeValue)) + minEdgeValue;

    let isDirected = directed && Math.random() > 0.5;
    let reverseDirection = directed && Math.random() > 0.5;

    // Find next vertex
    // RightSide
    if (colIndex < row.length-1) {
        let rightSideItems = row.slice(colIndex+1);

        for (let i = 0; i < rightSideItems.length; i++) {
            let rItem = rightSideItems[i];
            if (!rItem) {
                continue
            }
            else if (!rItem.isVertex) {
                if (!rItem.left === 1 || rItem.right === 1) {
                    break;
                }
            }
            else if (rItem.isVertex) {
                if (col.right === 1 && rItem.left === 1) {
                    if (reverseDirection) {
                        graph.edges.push(
                            new GraphEdge(col.vertex, rItem.vertex, edgeValue, isDirected)
                        )
                    } else {
                        graph.edges.push(
                            new GraphEdge(rItem.vertex, col.vertex, edgeValue, isDirected)
                        )
                    }
                }
                break
            }
        }
    }

    // BotSide
    if (rowIndex < WCFMatrix.length-1) {
        let botSideItems = [];
        WCFMatrix.slice(rowIndex+1).forEach(_row => {
            botSideItems.push(_row[colIndex]);
        })

        for (let i = 0; i < botSideItems.length; i++) {
            let bItem = botSideItems[i];
            if (!bItem) {
                break
            }
            else if (!bItem.isVertex) {
                if (!bItem.bot === 1 || bItem.top === 1) {
                    break;
                }
            }
            else if (bItem.isVertex) {
                if (col.bot === 1 && bItem.top === 1) {
                    if (reverseDirection) {
                        graph.edges.push(
                            new GraphEdge(col.vertex, bItem.vertex, edgeValue, isDirected)
                        )
                    } else {
                        graph.edges.push(
                            new GraphEdge(bItem.vertex, col.vertex, edgeValue, isDirected)
                        )
                    }
                }
                break
            }
        }
    }

    // Diagonal L-R
    if (rowIndex < WCFMatrix.length-1 && colIndex < row.length-1) {
        
        let _ci = colIndex + 1;
        for (let _ri = rowIndex+1; _ri < WCFMatrix.length-1; _ri++) {
            let diagItem = WCFMatrix[_ri][_ci];
            if (!diagItem) {
                break
            }
            else if (!diagItem.isVertex) {
                if (!diagItem.topLeft === 1 || diagItem.botRight === 1) {
                    break;
                }
            }
            else if (diagItem.isVertex) {
                if (col.botRight === 1 && diagItem.topLeft === 1) {
                    if (reverseDirection) {
                        graph.edges.push(
                            new GraphEdge(col.vertex, diagItem.vertex, edgeValue, isDirected)
                        )
                    } else {
                        graph.edges.push(
                            new GraphEdge(diagItem.vertex, col.vertex, edgeValue, isDirected)
                        )
                    }
                }
                break
            }
            _ci += 1;
        }
    }

    // Diagonal R-L
    if (rowIndex < WCFMatrix.length-1 && colIndex > 0) {
        
        let _ci = colIndex - 1;
        for (let _ri = rowIndex+1; _ri < WCFMatrix.length-1; _ri++) {
            let diagItem = WCFMatrix[_ri][_ci];
            if (!diagItem) {
                break
            }
            else if (!diagItem.isVertex) {
                if (!diagItem.botLeft === 1 || diagItem.topRight === 1) {
                    break;
                }
            }
            else if (diagItem.isVertex) {
                if (col.botLeft === 1 && diagItem.topRight === 1) {
                    if (reverseDirection) {
                        graph.edges.push(
                            new GraphEdge(col.vertex, diagItem.vertex, edgeValue, isDirected)
                        )
                    } else {
                        graph.edges.push(
                            new GraphEdge(diagItem.vertex, col.vertex, edgeValue, isDirected)
                        )
                    }
                }
                break
            }
            _ci -= 1;
        }
    }
}

function drawVertex(vertex) {
    scene.context.beginPath();
    scene.context.lineWidth = 1;
    scene.context.arc(vertex.posX, vertex.posY, 40, 0, 2 * Math.PI);
    scene.context.fillStyle = "#d6e8f5"
    scene.context.strokeStyle = "#008cc1"
    scene.context.fill();
    scene.context.stroke();
    scene.context.closePath();

    // Text
    scene.context.fillStyle = "#008cc1";
    scene.context.font = '24px sans-serif';
    scene.context.fillText(vertex.tag, vertex.posX-20, vertex.posY+10)
}

/**
 * 
 * @param {GraphEdge} edge 
 * @param {boolean} paralels 
 */
function drawEdge(edge, paralels=false) {
    scene.context.beginPath();
    let from = {x: edge.vertexA.posX, y: edge.vertexA.posY}
    let to = {x: edge.vertexB.posX, y: edge.vertexB.posY}
    let valueCoords = {
        x: (from.x + to.x) / 2 - 8,
        y: (from.y + to.y) / 2 + 8,
    }
    scene.context.moveTo(from.x, from.y);
    scene.context.lineTo(to.x, to.y);
    scene.context.fillStyle = "#d6e8f5"
    scene.context.strokeStyle = "#008cc1"
    scene.context.lineWidth = 1
    scene.context.stroke();
    if (edge.directed) {
        scene.context.fillStyle = "#008cc1"
        let arrowFrom = {
            x: (from.x + to.x)/2 ,
            y: (from.y + to.y)/2,
        }
        drawArrowhead(scene.context, arrowFrom, to, 10)
    }
    scene.context.closePath();


    if (edge.value > 0) {
        // Text box
        let w = scene.context.measureText(edge.value).width
        scene.context.clearRect(valueCoords.x - 5, valueCoords.y - 25, w+10, 35);
    
        // Text
        scene.context.fillStyle = "#008cc1";
        scene.context.font = '24px sans-serif';
        scene.context.fillText(edge.value, valueCoords.x, valueCoords.y)
    }
}


function drawArrowhead(context, from, to, radius) {

	let x_center = (from.x + to.x)/2;
	let y_center = (from.y + to.y)/2;

	let angle;
	let x;
	let y;

	context.beginPath();

	angle = Math.atan2(to.y - from.y, to.x - from.x)
	x = radius * Math.cos(angle) + x_center;
	y = radius * Math.sin(angle) + y_center;

	context.moveTo(x, y);

	angle += (1.0/3.0) * (2 * Math.PI)
	x = radius * Math.cos(angle) + x_center;
	y = radius * Math.sin(angle) + y_center;

	context.lineTo(x, y);

	angle += (1.0/3.0) * (2 * Math.PI)
	x = radius *Math.cos(angle) + x_center;
	y = radius *Math.sin(angle) + y_center;

	context.lineTo(x, y);

	context.closePath();

	context.fill();
}


/** @type {Graph} */
let currentGraph = generateNewScene();

