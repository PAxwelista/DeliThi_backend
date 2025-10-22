const {combineProducts} = require("./combineProducts")

const products = [{"name": "Tomate", "quantity": 5}, {"name": "Tomate", "quantity": 2}, {"name": "Pomme", "quantity": 2}]
const expectedProduct = [{"name": "Tomate", "quantity": 7},{"name": "Pomme", "quantity": 2}]

describe("combineProducts function" , ()=>{
    it("should return combined products" , ()=>{

        const resultProducts = combineProducts(products)
        expect(resultProducts).toEqual(expectedProduct)

    })
})