

/**
 * @param {Graph} graph
 * @param {GraphVertex} startVertex
 */
function generateDijkstraTable(graph, startVertex) {
    let visitedVertices = [];
    let distancesTable = {};

    // Initializing distances table
    graph.vertices.forEach(vertex => {
        distancesTable[vertex.tag] = {};
    })

    /** @type {GraphVertex[]} */
    let queue = [];
    queue.push(startVertex);

    while (queue.length != 0) {
        let currentVertex = queue[0];
        queue.shift();
        visitedVertices.push(currentVertex);

        let smallerPathValueToCurrentVertex = null;
        Object.keys(distancesTable[currentVertex.tag]).forEach(key => {
            if (smallerPathValueToCurrentVertex === null || distancesTable[currentVertex.tag][key] < smallerPathValueToCurrentVertex) {
                smallerPathValueToCurrentVertex = distancesTable[currentVertex.tag][key];
            }
        });
        if (smallerPathValueToCurrentVertex === null) {
            smallerPathValueToCurrentVertex = 0;
        }

        let sortedEdges = currentVertex.edges.sort((a, b) => {
            if (a.value < b.value) return -1;
            else if (a.value > b.value) return 1;
            return 0;
        });

        /** @type {GraphVertex[]} */
        let neighbors = currentVertex.neighbors;
        neighbors.forEach(neighbor => {
            if (visitedVertices.includes(neighbor)) return;
            
            let _edges = graph.findEdges(currentVertex, neighbor);

            /** @type {GraphEdge} */
            let edge = null;
            _edges.forEach(e => {
                if (edge == null || e.value < edge.value) {
                    edge = e;
                }
            })

            distancesTable[neighbor.tag][currentVertex.tag] = edge.value + smallerPathValueToCurrentVertex;
        })

        // Adding vertices to the queue (closest to furthest)
        sortedEdges.forEach(edge => {
            if (edge.vertexA == currentVertex) {
                if (visitedVertices.includes(edge.vertexB)) return;
                
                queue.push(edge.vertexB);
            } else if (!edge.directed) {
                if (visitedVertices.includes(edge.vertexA)) return;
                queue.push(edge.vertexA)
            }
        });
    }

    return distancesTable;
}

export {generateDijkstraTable}