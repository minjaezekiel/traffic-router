export class RouteService {

    constructor(router) {
        this.router = router;
    }

    getBestRoute(startId, goalId) {
        return this.router.findPath(startId, goalId);
    }
}