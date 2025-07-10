const { getShorterOrder } = require("./");

describe("getShorterOrder", () => {
    it("should return a correct order", () => {
        const matrix = [
            [0, 3, 7, 8, 1],
            [3, 0, 9, 12, 3],
            [7, 9, 0, 7, 8],
            [8, 12, 7, 0, 4],
            [1, 3, 8, 4, 0],
        ];

        expect(getShorterOrder(matrix)).toEqual([0,4,1,2,3]);
    });
    it("should return -1 if there is a undefined matrix", () => {
        const matrix = undefined

        expect(getShorterOrder(matrix)).toEqual([-1]);
    });
});
