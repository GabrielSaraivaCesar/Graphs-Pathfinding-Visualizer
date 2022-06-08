import {findsmallerPath} from './smaller_path.js';
import {isBridge} from './bridges.js';
import { TooMuchIterations } from './shared.js';

/** 
 * @param {Graph} graph
 * 
 * This algorithm will first find the odd degreed vertices and create more edges to make
 * the degree of these vertices to be even.
 * Id does it by first getting the smaller path between each one of them and comparing 
 * the sum of the paths. The less valued path will receive one more edge.
 * This rebuilds the graph with the most effective eulerian cycle
 * */
// TODO REFACTOR
 async function graphToOptimizedEulerian(graph) {
    /** @type {GraphVertex[]} */
    let oddDegreeVertices = graph.vertices.filter(v => v.degree % 2 !== 0);
    if (oddDegreeVertices.length === 0) {
        return;
    } else if (oddDegreeVertices.length === 2){
        let spath = findsmallerPath(graph, oddDegreeVertices[0], oddDegreeVertices[1]);
        addEdgesIntoPathes(graph, [spath.path]);
        return;
    }

    let combinationAmount = 1;
    oddDegreeVertices.forEach((v, i) => {
        combinationAmount *= (i+1);
    })
    if (combinationAmount > 40320) {
        throw new TooMuchIterations();
    }
    let combinationMaxLoad = Math.round(combinationAmount * 2.72);
    
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
            changeLoadingProgress(i+(j/oddDegreeVertices.length), oddDegreeVertices.length + combinationMaxLoad);
        }
    }

    /* combination analysis */
    

    let iterations = 0
    let combinationResult = await oddDegreeVertices.permutations(true, () => {
        iterations++;
        if (iterations % Math.round(combinationMaxLoad/10) == 0) {
            changeLoadingProgress(oddDegreeVertices.length + iterations, oddDegreeVertices.length + combinationMaxLoad);
        }
    });

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
    addEdgesIntoPathes(graph, lowerCombinationPathes);    
}

/**
 * @param {Graph} graph
 * @param {string[][]} pathes
 */
function addEdgesIntoPathes(graph, pathes) {
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
                new GraphEdge(vertexA, vertexB, bestEdge.value, bestEdge.directed, true)
            );
        }
    });
}

/**
 * @param {Graph} graph 
 * @param {GraphVertex} startVertex 
 */
function findEulerianCycle(graph, startVertex) {
    
    
    let finalPath = {path: [startVertex.tag], value: 0};
    let currentVertex = startVertex;
    let iterations = 0;

    let edgesCount = graph.edges.length;
    
    while (currentVertex != startVertex || edgesCount > 0) {
        /** @type {GraphEdge} */
        let selectedEdge = null;
        
        for (let i = 0; i < currentVertex.edges.length; i++) {
            let _edge = currentVertex.edges[i];
            let edgeIsBridge = isBridge(_edge);

            if (edgeIsBridge && i < currentVertex.edges.length-1) {
                continue;
            } else {
                selectedEdge = _edge;
                break;
            }
        }

        if (selectedEdge === null) {
            throw "Invalid graph";
        }
        let nextVertex = selectedEdge.vertexA == currentVertex ? selectedEdge.vertexB : selectedEdge.vertexA;

        // Remove the edge temporarily from vertices
        currentVertex.edges = currentVertex.edges.filter(e => e!=selectedEdge);
        nextVertex.edges = nextVertex.edges.filter(e => e!=selectedEdge);
        edgesCount--;
        finalPath.path.push(nextVertex.tag);
        finalPath.value += selectedEdge.value;

        currentVertex = nextVertex;
        iterations++;
    }

    // Rebuild edges to vertices relation
    graph.linkEdgesToVertices();

    return finalPath;
}

export {graphToOptimizedEulerian, findEulerianCycle}