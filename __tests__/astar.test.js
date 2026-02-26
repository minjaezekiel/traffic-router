import { Graph } from "../src/core/Graph.js";
import { AStarRouter } from "../src/core/AStarRouter.js";
import { TrafficAnalyzer } from "../src/traffic/TrafficAnalyzer.js";

describe("AI Traffic Router - A* Algorithm Tests", () => {

  let graph;
  let traffic;
  let router;

  beforeEach(() => {
    graph = new Graph();
    traffic = new TrafficAnalyzer();

    graph.addNode("A", 0, 0);
    graph.addNode("B", 0, 1);
    graph.addNode("C", 0, 2);
    graph.addNode("D", 0, 3);

    graph.addEdge("A", "B", 100);
    graph.addEdge("B", "C", 100);
    graph.addEdge("C", "D", 100);
    graph.addEdge("A", "C", 250);
    graph.addEdge("B", "D", 300);

    router = new AStarRouter(graph, traffic);
  });

  function calculateCost(path) {
    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const neighbors = graph.neighbors(path[i]);
      const edge = neighbors.find(n => n.to === path[i+1]);
      total += edge.distance;
    }
    return total;
  }

  test("Should reach goal node", () => {
    const path = router.findPath("A", "D");

    expect(path[0]).toBe("A");
    expect(path[path.length - 1]).toBe("D");
  });

  test("Should find optimal cost without traffic", () => {
    const path = router.findPath("A", "D");
    const cost = calculateCost(path);

    expect(cost).toBe(300); // true shortest cost
  });

  test("Should avoid congested node B", () => {
    traffic.congestionZones = [{ lat: 0, lon: 1 }];

    const path = router.findPath("A", "D");
    const cost = calculateCost(path);

    expect(cost).toBeGreaterThanOrEqual(300);
    expect(path).not.toContain("B");
  });

  test("Dynamic congestion changes path cost", () => {
    const normalPath = router.findPath("A", "D");
    const normalCost = calculateCost(normalPath);

    traffic.congestionZones = [{ lat: 0, lon: 2 }];

    const congestedPath = router.findPath("A", "D");
    const congestedCost = calculateCost(congestedPath);

    expect(congestedCost).toBeGreaterThanOrEqual(normalCost);
  });

  test("Should return null if no path exists", () => {
    graph.addNode("X", 10, 10);

    const path = router.findPath("A", "X");

    expect(path).toBeNull();
  });

  test("Should handle circular graph safely", () => {
    graph.addEdge("D", "A", 500);

    const path = router.findPath("A", "D");

    expect(path[path.length - 1]).toBe("D");
  });

});