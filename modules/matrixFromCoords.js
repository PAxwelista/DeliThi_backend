const { getDistanceBetweenCoords } = require("./getDistanceBetweenCoords");

const matrixFromCoords = coords => {
    const matrix = [];

    for (let i = 0; i < coords.length; i++) {
        matrix.push(coords.map(v => getDistanceBetweenCoords(v[1], v[0], coords[i][1], coords[i][0])));
    }
    return matrix;
};

module.exports = { matrixFromCoords };
