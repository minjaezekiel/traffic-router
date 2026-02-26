import { haversine } from "../core/Haversine.js";

export class ClusterEngine {

    constructor(radius = 50, minCluster = 5) {
        this.radius = radius;
        this.minCluster = minCluster;
    }

    detectClusters(users) {
        const clusters = [];

        for (let i = 0; i < users.length; i++) {
            const cluster = [];

            for (let j = 0; j < users.length; j++) {
                const dist = haversine(
                    users[i].lat, users[i].lon,
                    users[j].lat, users[j].lon
                );

                if (dist < this.radius && users[j].speed < 1) {
                    cluster.push(users[j]);
                }
            }

            if (cluster.length >= this.minCluster) {
                clusters.push(cluster);
            }
        }

        return clusters;
    }
}