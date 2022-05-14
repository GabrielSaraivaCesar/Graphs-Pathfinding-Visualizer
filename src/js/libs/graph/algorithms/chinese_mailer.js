import { NotReachablePathException, forEachPreventingFreezing } from './shared.js';
import { generateDijkstraTable } from './dijkstra.js';
import {findsmallerPath} from './smaller_path.js';

/** 
 * @param {Graph} graph
 * @param {GraphVertex} startVertex
 * @param {GraphVertex} endVertex
 */
async function findChineseMailerPath(graph, startVertex, endVertex) {
   

    // We need to make sure the graph is eulerian to make a clear path
    // The following method will guarantee we will make the most eficient path
    // using the eulerian path 
    await graphToEulerian(graph)

    let finalPath = {path: [startVertex.tag], value: 0};

    
    return finalPath;
}

/**
 * @param {GraphVertex} currentVertex
 * @param {GraphVertex} endVertex
 */
function getNextVertex(graph, currentVertex, endVertex, visitedEdges) {

}

/** @param {Graph} graph */
async function graphToEulerian(graph) {
    /** @type {GraphVertex[]} */
    let oddDegreeVertices = graph.vertices.filter(v => v.degree % 2 !== 0);
    if (oddDegreeVertices.length === 0) {
        return;
    } else if (oddDegreeVertices.length === 2){
        let spath = findsmallerPath(graph, oddDegreeVertices[0], oddDegreeVertices[1]);
        addEdgesIntoPath(graph, spath);
        return;
    }
    
    /* Calculate the distance between each oddDegreeVertex to another */
    let paths = {}
    for (let i = 0; i < oddDegreeVertices.length; i++) {
        let vertexA = oddDegreeVertices[i];
        paths[vertexA.tag] = {
            vertex: vertexA,
            targets: {}
        };

        for (let j = 0; j < oddDegreeVertices.length; j++) {
            if (j === i) continue;
            /* 
            This promise followed by a timeout is a technique to avoid page break,
            since this process can be a lot demanding depending on the amount of vertices.

            This allows the browser to balance the process between cycles by running the heavy code
            in many cycles instead of only one
            */
            await new Promise((resolve) => {
                window.setTimeout(() => {
                    let vertexB = oddDegreeVertices[j]; 
                    let pathObj = findsmallerPath(graph, vertexA, vertexB, true);
                    if (pathObj !== null) {
                        paths[vertexA.tag].targets[vertexB.tag] = pathObj;
                    }
                    resolve()
                })
            })
        }
        // console.log(i+"/"+oddDegreeVertices.length)
    }

    /* combination analysis */
    let combinationResult = [];
    let mutableVerticesArray = [...oddDegreeVertices];
    for (let i = 0; i < mutableVerticesArray.length-1; i++) { // For each vertex
        
        let movingItem = mutableVerticesArray[0];

        for (let currentPos = 0; currentPos < mutableVerticesArray.length-1; currentPos += 2) { // Move the first item through all positions skippign 2 by 2
            if ((currentPos === 0 && i > 0) || (i == mutableVerticesArray.length-2 && currentPos == i)) continue;
            let newArr = new Array(mutableVerticesArray.length);
            newArr[currentPos] = movingItem;

            let vPos = 0;
            mutableVerticesArray.filter(v => v!=movingItem)
            .forEach(vertex => {
                if (vPos === currentPos) vPos++;
                newArr[vPos] = vertex;
                vPos++;
            })

            mutableVerticesArray = newArr;
            combinationResult.push(mutableVerticesArray);
        }
    }

    /* Get the most effective couples */
    let lowerCombinationSum = null;
    let lowerCombinationPathes = null;
    
    combinationResult.forEach(combinationArray => {
        let combinationSum = 0;
        let combinationPathes = [];
        let invalid = false;
        for (let i = 0; i < combinationArray.length - 1; i += 2) {
            let vertexA = combinationArray[i];
            let vertexB = combinationArray[i+1];
            if (!paths[vertexA.tag].targets[vertexB.tag]) {
                invalid = true;
            } else {
                combinationSum += paths[vertexA.tag].targets[vertexB.tag].value;
                combinationPathes.push(paths[vertexA.tag].targets[vertexB.tag].path);
            }
        }
        if ((lowerCombinationSum === null || combinationSum < lowerCombinationSum) && !invalid) {
            lowerCombinationSum = combinationSum;
            lowerCombinationPathes = combinationPathes;
        }
    })

    /* Adding the new edges to make it eulerian */
    addEdgesIntoPath(graph, lowerCombinationPathes);    
}

function addEdgesIntoPath(graph, pathes) {
    pathes.forEach(path => {
        for (let i = 1; i < path.length; i++) {
            let v1Tag = path[i-1];
            let v2Tag = path[i];
            let vertexA = graph.vertices.find(v => v.tag === v1Tag);
            let vertexB = graph.vertices.find(v => v.tag === v2Tag);

            let originalEdges = graph.findEdges(vertexA, vertexB);
            let bestEdge = null;
            originalEdges.forEach(e => {
                if (bestEdge === null || e.value < bestEdge.value) {
                    bestEdge = e;
                }
            });

            graph.edges.push(
                new GraphEdge(vertexA, vertexB, bestEdge.value, bestEdge.directed)
            );
        }
    });
}

export {findChineseMailerPath}