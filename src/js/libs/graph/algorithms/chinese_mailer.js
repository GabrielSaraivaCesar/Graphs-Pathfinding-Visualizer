import { NotReachablePathException } from './shared.js';
import { generateDijkstraTable } from './dijkstra.js';
import {findClosestPath} from './closest_path.js';

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

function graphToEulerian(graph) {
    let oddDegreeVertices = graph.vertices.filter(v => v.degree % 2 !== 0);
    let analysisPaths = {}
    console.log(oddDegreeVertices)

    oddDegreeVertices.forEach(vertex => {
        analysisPaths[vertex.tag] = {
            vertex: vertex,
            distances: [
                {
                    targetVertex: null,
                    value: 0
                }
            ]
        }

        oddDegreeVertices.filter(v => v != vertex).forEach(targetVertex => {
            let closestPath = findClosestPath(graph, vertex, targetVertex);
            analysisPaths[vertex.tag].distances.push({
                targetVertex: targetVertex,
                value: closestPath.value,
                path: closestPath.path
            })
        })
    })

    let combinatorialAnalysis = [];

    console.log(analysisPaths);
}

export {findChineseMailerPath}