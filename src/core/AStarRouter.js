import { haversine } from "./Haversine.js";

export class AStarRouter {

    constructor(graph, trafficAnalyzer) {
        this.graph = graph;
        this.traffic = trafficAnalyzer;
    }

    heuristic(a, b) {
        return haversine(a.lat, a.lon, b.lat, b.lon);
    }

    findPath(startId, goalId) {
        const openSet = new Set([startId]);
        const cameFrom = new Map();

        const gScore = new Map();
        const fScore = new Map();

        gScore.set(startId, 0);
        fScore.set(startId, 0);

        while (openSet.size > 0) {
            let current = [...openSet].reduce((a, b) =>
                fScore.get(a) < fScore.get(b) ? a : b
            );

            if (current === goalId) {
                return this.reconstructPath(cameFrom, current);
            }

            openSet.delete(current);

            for (const edge of this.graph.neighbors(current)) {
                const neighbor = edge.to;
                const node = this.graph.getNode(neighbor);

                const tentative =
                    gScore.get(current) +
                    edge.distance +
                    this.traffic.trafficPenalty(node);

                if (!gScore.has(neighbor) || tentative < gScore.get(neighbor)) {
                    cameFrom.set(neighbor, current);
                    gScore.set(neighbor, tentative);

                    const goalNode = this.graph.getNode(goalId);

                    fScore.set(
                        neighbor,
                        tentative + this.heuristic(node, goalNode)
                    );

                    openSet.add(neighbor);
                }
            }
        }

        return null;
    }

    reconstructPath(cameFrom, current) {
        const path = [current];
        while (cameFrom.has(current)) {
            current = cameFrom.get(current);
            path.unshift(current);
        }
        return path;
    }
}