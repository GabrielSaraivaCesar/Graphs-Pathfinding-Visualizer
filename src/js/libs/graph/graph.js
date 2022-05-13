class GraphEdge {
    /** @type {GraphVertex} */
    vertexA = null;

    /** @type {GraphVertex} */
    vertexB = null;

    /** @type {number} */
    value = 1;

    /** @type {boolean} */
    directed = false;

    constructor(vertexA, vertexB, value = 1, directed = false) {
        this.vertexA = vertexA;
        this.vertexB = vertexB;
        this.value = value;
        this.vertexA.edges.push(this);
        this.vertexB.edges.push(this);
        this.directed = directed;
    }
}

class GraphVertex {
    /** @type {string} */
    tag = "";
    /** @type {number} */
    posX = 0;
    /** @type {number} */
    posY = 0;
    /** @type {GraphEdge[]} */
    edges = [];

    get degree() {
        return this.edges.length;
    }

    get neighbors() {
        let result = [];
        this.edges.forEach(edge => {
            if (edge.vertexA == this) {
                result.push(edge.vertexB);
            } else {
                result.push(edge.vertexA);
            }
        });
        return result;
    }

    constructor(tag) {
        this.tag = tag;
    }
}

class Graph {

    /** @type {GraphVertex[]} */
    vertices = [];

    /** @type {GraphEdge[]} */
    edges = [];

    findEdges(vertexA, vertexB) {
        return this.edges.filter(edge => {
            return (edge.vertexA == vertexA && edge.vertexB == vertexB) || (edge.vertexB == vertexA && edge.vertexA == vertexB)
        });
    }
}