class GraphEdge {
    /** @type {GraphVertex} */
    vertexA = null;

    /** @type {GraphVertex} */
    vertexB = null;

    /** @type {number} */
    value = 1;

    constructor(vertexA, vertexB, value = 1) {
        this.vertexA = vertexA;
        this.vertexB = vertexB;
        this.value = value;
        this.vertexA.edges.push(this);
        this.vertexB.edges.push(this);
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

    constructor(tag) {
        this.tag = tag;
    }
}

class Graph {

    /** @type {GraphVertex[]} */
    vertices = [];

    /** @type {GraphEdge[]} */
    edges = [];

}