export class Graph {
    constructor() {
        this.nodes = new Map();
        this.edges = new Map();
    }

    addNode(id, lat, lon) {
        this.nodes.set(id, { id, lat, lon });
        this.edges.set(id, []);
    }

    addEdge(startId, endId, distance) {
        this.edges.get(startId).push({
            to: endId,
            distance
        });
    }

    neighbors(nodeId) {
        return this.edges.get(nodeId) || [];
    }

    getNode(id) {
        return this.nodes.get(id);
    }
}