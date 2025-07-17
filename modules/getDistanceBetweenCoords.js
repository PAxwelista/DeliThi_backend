const getDistanceBetweenCoords = (latitude1, longitude1, latitude2, longitude2) => {
    let theta = longitude1 - longitude2;

    let distance =
        60 *
        1.1515 *
        (180 / Math.PI) *
        Math.acos(
            Math.sin(latitude1 * (Math.PI / 180)) * Math.sin(latitude2 * (Math.PI / 180)) +
                Math.cos(latitude1 * (Math.PI / 180)) *
                    Math.cos(latitude2 * (Math.PI / 180)) *
                    Math.cos(theta * (Math.PI / 180))
        )*1.609344

        return Number(distance.toFixed(2)) || 0
};


module.exports = { getDistanceBetweenCoords };
