var express = require("express");
var router = express.Router();
var polyline = require("@mapbox/polyline");
const { checkBody, getShorterOrder, matrixFromCoords, jsonResponse } = require("../modules");

const OPENROUTESERVERVICE_APIKEY = process.env.OPENROUTESERVERVICE_APIKEY;
const GOOGLE_MAPS_APIKEY = process.env.GOOGLE_MAPS_APIKEY;

router.post("/order", async (req, res) => {
    if (!checkBody(req.body, ["waypointsCoords"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const { waypointsCoords } = req.body;
    const coordsWaypoints = waypointsCoords.map(v => [v.longitude, v.latitude]);
    let order;

    if (coordsWaypoints.length > 50) {
        // openRouteApi is not able to handle when there is more than 50 locations

        order = getShorterOrder(matrixFromCoords(coordsWaypoints));
    } else {
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

        let jsonMatrix = await dataMatrix.json();

        if (jsonMatrix.error)
            return res.status(404).json({ result: false, error: jsonMatrix.error || jsonMatrix.message });

        order = getShorterOrder(jsonMatrix.durations);
    }

    res.status(200).json({
        result: true,
        orderCoords: coordsWaypoints.map((_, i) => ({
            latitude: coordsWaypoints[order[i]][1],
            longitude: coordsWaypoints[order[i]][0],
        })),
        order: order,
    });
});

router.post("/", async (req, res) => {
    if (!checkBody(req.body, ["waypointsCoords"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const { waypointsCoords } = req.body;

    const coordsWaypoints = waypointsCoords.map(v => [v.longitude, v.latitude]).filter((_, i) => i < 70); // openApi let just have max 70 routes

    try {
        const dataDirection = await fetch(
            `https://api.openrouteservice.org/v2/directions/driving-car`,
            {
                method: "POST",
                body: JSON.stringify({
                    coordinates: coordsWaypoints,
                    radiuses: [1000],
                }),
                headers: {
                    Authorization: `Bearer ${OPENROUTESERVERVICE_APIKEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const jsonDirection = await dataDirection.json();
        if (jsonDirection?.error?.code)
            return res.status(404).json({ result: false, error: jsonDirection.error.message });

        res.json({
            result: true,
            globalPolyline: polyline.decode(jsonDirection?.routes[0].geometry),
            directionInfos: jsonDirection?.routes[0].segments,
        });
    } catch (error) {
        try {
            const allCoordsText = waypointsCoords
                .filter((_, i) => i != 0 && i <= 10)
                .reduce((a, v) => a + "|" + v.latitude + "," + v.longitude, "");
            const dataGoogleDirection = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${waypointsCoords[0].latitude},${waypointsCoords[0].longitude}&destination=${waypointsCoords[11].latitude},${waypointsCoords[11].longitude}&waypoints=${allCoordsText}&language=fr&key=${GOOGLE_MAPS_APIKEY}`,
                {}
            );

            const jsonGoogleDirection = await dataGoogleDirection.json();
            res.json({
                result: true,
                globalPolyline: polyline.decode(jsonGoogleDirection.routes[0].overview_polyline.points),
                directionInfos: jsonGoogleDirection.routes[0].legs.map(leg => ({
                    distance: leg.distance.value,
                    duration: leg.duration.value,
                })),
            });
        } catch (error) {
            return jsonResponse(res, { status: 500, error: String(error), result: false });
        }
    }
});

module.exports = router;
