import {generateDijkstraTable} from './dijkstra.js';
import { NotReachablePathException } from './shared.js';
/**
 * @typedef PathObject
 * @property {string[]} path
 * @property {number} value
 */
/** 
 * @param {Graph} graph
 * @param {GraphVertex} startVertex
 * @param {GraphVertex} endVertex
 * @param {boolean?} soft 
 * @returns {PathObject}
 */
function findsmallerPath(graph, startVertex, endVertex, soft=false) {
    let dijkstraDistanceTable = generateDijkstraTable(graph, startVertex);
    if (Object.keys(dijkstraDistanceTable[endVertex.tag]).length === 0) {
        if (soft) return null;
        throw new NotReachablePathException()
    }

    let path = [];
    let value = null;
    Object.keys(dijkstraDistanceTable[endVertex.tag]).forEach(key => {
        if (value === null || dijkstraDistanceTable[endVertex.tag][key] < value) {
            value = dijkstraDistanceTable[endVertex.tag][key];
        }
    })

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
    return {path: path, value: value};
}

export {findsmallerPath}