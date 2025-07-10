var express = require("express");
var router = express.Router();
var polyline = require("@mapbox/polyline");
const { checkBody, getShorterOrder } = require("../modules");

const OPENROUTESERVERVICE_APIKEY = process.env.OPENROUTESERVERVICE_APIKEY;

router.post("/order", async (req, res) => {
    if (!checkBody(req.body, ["waypointsCoords"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const { waypointsCoords } = req.body;

    const coordsWaypoints = waypointsCoords.map(v => [v.longitude, v.latitude]);

    const dataMatrix = await fetch(`https://api.openrouteservice.org/v2/matrix/driving-car`, {
        method: "POST",
        body: JSON.stringify({
            locations: coordsWaypoints,
        }),
        headers: {
            Authorization: `Bearer ${OPENROUTESERVERVICE_APIKEY}`,
            "Content-Type": "application/json",
        },
    });

    const jsonMatrix = await dataMatrix.json();

    if (jsonMatrix.status === "NOT_FOUND") return res.status(404).json({ result: false, error: "Direction not found" });
    if (jsonMatrix.status === "ZERO_RESULTS") return res.status(404).json({ result: false, error: "Zero result" });

    const order = getShorterOrder(jsonMatrix.durations);

    res.status(200).json({
        result: true,
        orderCoords: coordsWaypoints.map((_, i) => ({
            latitude: coordsWaypoints[order[i]][1],
            longitude: coordsWaypoints[order[i]][0],
        })),
        order : order
    });
});

router.post("/", async (req, res) => {
    if (!checkBody(req.body, ["waypointsCoords"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const { waypointsCoords } = req.body;

    const coordsWaypoints = waypointsCoords.map(v => [v.longitude, v.latitude]);

    const dataDirection = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car`, {
        method: "POST",
        body: JSON.stringify({
            coordinates: coordsWaypoints,
        }),
        headers: {
            Authorization: `Bearer ${OPENROUTESERVERVICE_APIKEY}`,
            "Content-Type": "application/json",
        },
    });

    const jsonDirection = await dataDirection.json();

    if (jsonDirection?.error?.code) return res.status(404).json({ result: false, error: jsonDirection.error.message });

    res.json({
        result: true,
        globalPolyline: polyline.decode(jsonDirection.routes[0].geometry),
        directionInfos: jsonDirection.routes[0].segments,
    });
});

module.exports = router;
