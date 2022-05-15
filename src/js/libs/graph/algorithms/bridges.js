import {DepthFirstSearch} from './traversers.js';

/**
 * @param {Graph} graph
 */
function detectBridges(graph) {
    let bridges = [];
    graph.edges.forEach(edge => {
        let edgeIsBridge = isBridge(edge);
        if (edgeIsBridge) { // If the scan is different, the edge is a bridge
            bridges.push(edge);
        }
    });
    return bridges;
}

function isBridge(edge) {
    let verticesFoundFirstScan = DepthFirstSearch(edge.vertexA);

    // Remove the edge temporarily to make the second scan
    let vertexAEdgesCopy = edge.vertexA.edges;
    let vertexBEdgesCopy = edge.vertexB.edges;
    
    edge.vertexA.edges = edge.vertexA.edges.filter(e => e!=edge);
    edge.vertexB.edges = edge.vertexB.edges.filter(e => e!=edge);

    let verticesFoundSecondScan = DepthFirstSearch(edge.vertexA);
    
    // Relocate the edge
    edge.vertexA.edges = vertexAEdgesCopy;
    edge.vertexB.edges = vertexBEdgesCopy;

    let isBridgeResult = verticesFoundFirstScan !== verticesFoundSecondScan;
    return isBridgeResult;    
}

export {detectBridges, isBridge};