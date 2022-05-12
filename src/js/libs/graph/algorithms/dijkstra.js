

/**
 * @param {Graph} graph
 * @param {GraphVertex} startVertex
 */
function generateDijkstraTable(graph, startVertex) {
    let visitedVertices = {};
    let distancesTable = {}

    // Initializing distances table
    graph.vertices.forEach(vertex => {
        distancesTable[vertex.tag] = {};
    })

    let queue = [];
    queue.push(startVertex);

    while (queue.length != 0) {
        
    }
}