import { ClusterEngine } from "./ClusterEngine.js";
import { haversine } from "../core/Haversine.js";

export class TrafficAnalyzer {

    constructor() {
        this.clusterEngine = new ClusterEngine();
        this.liveUsers = [];
        this.congestionZones = [];
    }

    updateUserLocation(user) {
        const index = this.liveUsers.findIndex(u => u.id === user.id);
        if (index >= 0) {
            this.liveUsers[index] = user;
        } else {
            this.liveUsers.push(user);
        }

        this.detectCongestion();
    }

    detectCongestion() {
        const clusters = this.clusterEngine.detectClusters(this.liveUsers);

        this.congestionZones = clusters.map(cluster => {
            return {
                lat: cluster[0].lat,
                lon: cluster[0].lon
            };
        });
    }

    trafficPenalty(node) {
        let penalty = 0;

        for (const zone of this.congestionZones) {
            const dist = haversine(node.lat, node.lon, zone.lat, zone.lon);
            if (dist < 100) penalty += 1000;
        }

        return penalty;
    }
}