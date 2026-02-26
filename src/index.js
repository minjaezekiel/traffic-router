// Core
import { Graph } from "./core/Graph.js";
import { AStarRouter } from "./core/AStarRouter.js";
import { haversine } from "./core/Haversine.js";

// Traffic
import { TrafficAnalyzer } from "./traffic/TrafficAnalyzer.js";
import { ClusterEngine } from "./traffic/ClusterEngine.js";

// Services
import { RouteService } from "./services/RouteService.js";

// Realtime
import { startSocketServer } from "./realtime/socketServer.js";

/**
 * Factory function to quickly create a fully wired router system
 */
export function createTrafficRouter(graphConfig = []) {
    const graph = new Graph();
    const trafficAnalyzer = new TrafficAnalyzer();

    // Auto-load nodes + edges if provided
    graphConfig.forEach(item => {
        if (item.type === "node") {
            graph.addNode(item.id, item.lat, item.lon);
        }

        if (item.type === "edge") {
            graph.addEdge(item.from, item.to, item.distance);
        }
    });

    const router = new AStarRouter(graph, trafficAnalyzer);
    const routeService = new RouteService(router);

    return {
        graph,
        trafficAnalyzer,
        router,
        routeService
    };
}

/**
 * Export all components for advanced usage
 */
export {
    Graph,
    AStarRouter,
    TrafficAnalyzer,
    ClusterEngine,
    RouteService,
    startSocketServer,
    haversine
};