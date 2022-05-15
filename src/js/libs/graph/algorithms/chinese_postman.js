import {graphToOptimizedEulerian, findEulerianCycle} from './euler.js';
import {generateDijkstraTable} from './dijkstra.js';
import { NotReachablePathException } from './shared.js';

/** 
 * @param {Graph} graph
 * @param {GraphVertex} startVertex
 * @param {GraphVertex} endVertex
 */
async function findChinesePostmanPath(graph, startVertex) {
    let dijkstraDistanceTable = generateDijkstraTable(graph, startVertex);
    let tableKeys = Object.keys(dijkstraDistanceTable);
    for (let i = 0; i < tableKeys.length; i++) {
        if (tableKeys[i] != startVertex.tag && Object.keys(dijkstraDistanceTable[tableKeys[i]]).length === 0) { // The first vertex will always be empty
            throw new NotReachablePathException();
        }
    }
   
    // We need to make sure the graph is eulerian to make a clear path
    // The following method will guarantee we will make the most eficient path
    // using the eulerian path 
    await graphToOptimizedEulerian(graph)

    // After converting the graph to eulerian we only need to find the eulerian cycle 
    let finalPath = findEulerianCycle(graph, startVertex);

    return finalPath;
}


export {findChinesePostmanPath}