

/**
 * 
 * @param {GraphVertex} startVertex 
 * @returns {number}
 */
function DepthFirstSearch(startVertex) {
    let vertexStack = [];
    let visitedVertices = {};
    let currentVertex = startVertex;
    let verticesLen = 1;
    let iterations = 0;
    while (vertexStack.length > 0 || iterations === 0) {
        if (!visitedVertices[currentVertex.tag]) {
            vertexStack.push(currentVertex);
        }

        visitedVertices[currentVertex.tag] = true;

        // Find first not visited neighbor
        let neighbors = currentVertex.neighbors;
        let foundNeighbor = null;
        for (let i = 0; i < neighbors.length; i++) {
            let neighborVertex = neighbors[i];
            if ( !visitedVertices[neighborVertex.tag] ) { // If vertex was not visited
                foundNeighbor = neighborVertex;
                break; // Next vertex found
            }
        }
        
       
        if (foundNeighbor !== null) {
            currentVertex = foundNeighbor;
            verticesLen++;
        } else { // No unvisited neighbors
            vertexStack.pop();
            currentVertex = vertexStack[vertexStack.length-1];
        }

        iterations++;
    }

    return verticesLen;
}

// TODO
// https://www.tutorialspoint.com/data_structures_algorithms/breadth_first_traversal.htm

export {DepthFirstSearch};