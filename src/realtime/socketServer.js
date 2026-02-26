import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";

export function startSocketServer(server, trafficAnalyzer) {

    const wss = new WebSocketServer({ server });

    wss.on("connection", ws => {

        const userId = uuidv4();

        ws.on("message", message => {
            const data = JSON.parse(message);

            trafficAnalyzer.updateUserLocation({
                id: userId,
                lat: data.lat,
                lon: data.lon,
                speed: data.speed
            });

            ws.send(JSON.stringify({
                status: "updated",
                congestionZones: trafficAnalyzer.congestionZones
            }));
        });

        ws.on("close", () => {
            console.log("User disconnected");
        });
    });
}