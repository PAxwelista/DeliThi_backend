var express = require("express");
var router = express.Router();
var polyline = require("@mapbox/polyline");
const { checkBody } = require("../modules/checkBody");

const GOOGLE_MAPS_APIKEY = process.env.GOOGLE_MAPS_APIKEY;

router.post("/", async (req, res) => {

    if (!checkBody(req.body, ["originCoords", "waypointsCoords"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const { originCoords, waypointsCoords } = req.body;
    const allCoordsText = waypointsCoords.reduce((a, v) => a + "|" + v.latitude + "," + v.longitude, "");

    const data = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${originCoords.latitude},${originCoords.longitude}&destination=${originCoords.latitude},${originCoords.longitude}&waypoints=optimize:true${allCoordsText}&language=fr&key=${GOOGLE_MAPS_APIKEY}`
    );

   
    // const data = await fetch(
    //     `https://maps.googleapis.com/maps/api/directions/json?origin=28 rue du Fonteux Aumetz&destination=1 quai général Leclerc Verdun&key=${GOOGLE_MAPS_APIKEY}`
    // ); tests pour le temps qui me praraissais plus cours

    //C'est le fetch de google qui prend environ 5 secondes

    const json = await data.json();



    if (json.status === "NOT_FOUND") return res.status(404).json({ result: false, error: "Direction not found" });
    if (json.status === "ZERO_RESULTS") return res.status(404).json({ result: false, error: "Zero result" });
    res.json({
        result: true,
        globalPolyline: polyline.decode(json.routes[0].overview_polyline.points),
        firstPolyline: json.routes[0].legs[0].steps.reduce(
            (a, step) => [...a, ...polyline.decode(step.polyline.points)],
            []
        ),
        firstDirectionInfos: json.routes[0].legs[0],
        order: json.routes[0].waypoint_order,
    });
});

module.exports = router;
