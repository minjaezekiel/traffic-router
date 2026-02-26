import express from "express";
import http from "http";

import { Graph } from "./src/core/Graph.js";
import { TrafficAnalyzer } from "./src/traffic/TrafficAnalyzer.js";
import { AStarRouter } from "./src/core/AStarRouter.js";
import { RouteService } from "./src/services/RouteService.js";
import { startSocketServer } from "./src/realtime/socketServer.js";

const app = express();
const server = http.createServer(app);

const graph = new Graph();
const trafficAnalyzer = new TrafficAnalyzer();

// Example nodes
graph.addNode("A", -6.8, 39.28);
graph.addNode("B", -6.81, 39.29);
graph.addNode("C", -6.82, 39.30);

graph.addEdge("A", "B", 300);
graph.addEdge("B", "C", 300);
graph.addEdge("A", "C", 800);

const router = new AStarRouter(graph, trafficAnalyzer);
const routeService = new RouteService(router);

app.get("/route", (req, res) => {
    const { start, goal } = req.query;
    const path = routeService.getBestRoute(start, goal);
    res.json({ path });
});

startSocketServer(server, trafficAnalyzer);

server.listen(3000, () =>
    console.log("AI Traffic Router running on port 3000")
);