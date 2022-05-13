import {generateDijkstraTable} from './dijkstra.js';

/** 
 * @param {Graph} graph
 * @param {GraphVertex} startVertex
 * @param {GraphVertex} endVertex
 */
function findClosestPath(graph, startVertex, endVertex) {
    let dijkstraDistanceTable = generateDijkstraTable(graph, startVertex);
    console.log(dijkstraDistanceTable);

    let path = [];

    path.unshift(endVertex.tag);

    while (path[0] != startVertex.tag) {
        let currentVertexTag = path[0];
        let previousVertex = null;
        Object.keys(dijkstraDistanceTable[currentVertexTag]).forEach(v => {
            if (previousVertex === null || dijkstraDistanceTable[currentVertexTag][v] < dijkstraDistanceTable[currentVertexTag][previousVertex]) {
                previousVertex = v;
            }
        });
        if (!previousVertex) break;
        path.unshift(previousVertex);
    }

    return path;
}

export {findClosestPath}