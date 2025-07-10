function getShorterOrder(matrix) {
    const order = [0];

    if (!matrix) return [-1];

    for (let i = 1; i < matrix.length; i++) {
        const line = matrix[order[order.length - 1]];

        const nextShorterIndex = line
            .map((value, index) => ({ value, index }))
            .filter(v => !order.includes(v.index))
            .sort((a, b) => a.value - b.value)[0].index;

        order.push(nextShorterIndex);
    }

    return twoOpt(order,matrix);
}

function totalDistance(matrix, path) {
    let dist = 0;
    for (let i = 0; i < path.length - 1; i++) {
        dist += matrix[path[i]][path[i + 1]];
    }
    return dist;
}

function twoOpt(path, matrix) {
    let improved = true;
    while (improved) {
        improved = false;
        for (let i = 1; i < path.length - 2; i++) {
            for (let k = i + 1; k < path.length - 1; k++) {
                const newPath = path.slice();
                newPath.splice(i, k - i + 1, ...path.slice(i, k + 1).reverse());
                if (totalDistance(matrix, newPath) < totalDistance(matrix, path)) {
                    path = newPath;
                    improved = true;
                }
            }
        }
    }
    return path;
}

module.exports = { getShorterOrder };
