const {extractProductsFromOrders} = require("./extractProductsFromOrders")
const deliveriesMock = require("../services/test/deliveriesMock")

describe("extractProductsFromOrder function" , ()=>{
    it("should return list of proudcts" ,()=>{

        const products = extractProductsFromOrders(deliveriesMock[0].orders)

        expect(products).toContainEqual({"name": "Tomate", "quantity": 5})

    })
})