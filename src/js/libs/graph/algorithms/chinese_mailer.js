import { NotReachablePathException, forEachPreventingFreezing } from './shared.js';
import { generateDijkstraTable } from './dijkstra.js';
import {findsmallerPath} from './closest_path.js';

/** 
 * @param {Graph} graph
 * @param {GraphVertex} startVertex
 * @param {GraphVertex} endVertex
 */
function findChineseMailerPath(graph, startVertex, endVertex) {
    let dijkstraDistanceTable = generateDijkstraTable(graph, startVertex);
    if (Object.keys(dijkstraDistanceTable[endVertex.tag]).length === 0) {
        throw new NotReachablePathException()
    }
    graphToEulerian(graph)

    let path = [];

    // path.unshift(endVertex.tag);

    // while (path[path.length] != endVertex.tag) {
    //     let currentVertexTag = path[0];
    //     let previousVertex = null;

    //     Object.keys(dijkstraDistanceTable[currentVertexTag]).forEach(v => {
    //         if (previousVertex === null || dijkstraDistanceTable[currentVertexTag][v] < dijkstraDistanceTable[currentVertexTag][previousVertex]) {
    //             previousVertex = v;
    //         }
    //     });

    //     if (!previousVertex) break;
    //     path.unshift(previousVertex);
    // }

    return path;
}

async function graphToEulerian(graph) {
    let oddDegreeVertices = graph.vertices.filter(v => v.degree % 2 !== 0);
    let analysisPaths = {}

}

export {findChineseMailerPath}