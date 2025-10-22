const deliveriesMock = require("./deliveriesMock");

const mockPopulate = jest.fn();
const mockFind = jest.fn().mockReturnValue({
    populate: mockPopulate,
});
const mockFindById = jest.fn().mockReturnValue({
    populate: mockPopulate,
});
const mockFindOne = jest.fn().mockReturnValue({
    populate: mockPopulate,
});

const mockSave = jest.fn().mockReturnValue({
    populate: mockPopulate,
});

const mockUpdateOne = jest.fn();

const mockDeleteOne = jest.fn()

const MockDelivery = jest.fn(function (data) {
    this.data = data;
    this.save = mockSave;
});

MockDelivery.find = mockFind;
MockDelivery.findById = mockFindById;
MockDelivery.findOne = mockFindOne;
MockDelivery.updateOne = mockUpdateOne;
MockDelivery.deleteOne=mockDeleteOne

jest.mock("../../models/deliveries", () => MockDelivery);

const {
    getAllDeliveries,
    getDelivery,
    getDeliveryProducts,
    getActualDelivery,
    createDelivery,
    updateState,
    removeOrders,
    deleteDelivery
} = require("../deliveries");

const group = "group1";

beforeEach(() => {
    mockPopulate.mockClear();
    mockFind.mockClear();
    mockFindById.mockClear();
    mockFindOne.mockClear();
    mockSave.mockClear();
    MockDelivery.mockClear();
    mockUpdateOne.mockClear();
});

describe("getAllDeliveries function", () => {
    it("should not return all deliveries without group", async () => {
        mockPopulate.mockReturnValueOnce([]);
        const deliveries = await getAllDeliveries();
        expect(deliveries.length).toBe(0);
    });
    it("should return all deliveries", async () => {
        mockPopulate.mockReturnValueOnce(deliveriesMock);
        const deliveries = await getAllDeliveries(group);
        expect(mockFind).toHaveBeenCalledWith({ group });
        expect(mockPopulate).toHaveBeenCalled();
        expect(deliveries).toBe(deliveriesMock);
    });
});

describe("getDelivery function" , ()=>{
    it ("should return the delivery with the correct id" ,async ()=>{
        const value = "delivery"
        const id = "12"
        mockFindById.mockReturnValueOnce(value)
        const delivery = await getDelivery(id)
        expect(delivery).toBe(value)
        expect(mockFindById).toHaveBeenCalledWith(id)
    })
})

describe("getDeliveryProducts function", () => {
    const id = "test";

    it("should return nothing if the id don't correspond to any delivery", async () => {
        mockPopulate.mockReturnValueOnce(null);
        const products = await getDeliveryProducts(id);
        expect(products).toBeNull();
    });

    it("should return the products", async () => {
        mockPopulate.mockReturnValueOnce(deliveriesMock[0]);
        const products = await getDeliveryProducts(id);
        expect(products).toBeTruthy();
    });
});
describe("getActualDelivery function", () => {
    it("should not return the delivery without group", async () => {
        mockPopulate.mockReturnValueOnce(null);
        const deliveries = await getActualDelivery();
        expect(deliveries).toBeNull();
    });
    it("should return all deliveries", async () => {
        mockPopulate.mockReturnValueOnce(deliveriesMock[0]);
        const deliveries = await getActualDelivery(group);
        expect(mockFindOne).toHaveBeenCalledWith({ group, state: "processing" });
        expect(mockPopulate).toHaveBeenCalled();
        expect(deliveries).toBe(deliveriesMock.find(v => v.state === "processing"));
    });
});

describe("createDelivery function", () => {
    it("should not create the delivery without group", async () => {
        mockPopulate.mockReturnValueOnce(null);
        const delivery = await createDelivery();
        expect(delivery).toBeNull();
    });
    it("should create a new delivery", async () => {
        mockPopulate.mockReturnValueOnce(deliveriesMock[0]);
        const delivery = await createDelivery();

        expect(delivery).toEqual(deliveriesMock[0]);
        expect(mockSave).toHaveBeenCalledTimes(1);
    });
});

describe("updateState function", () => {
    it("should update the state", async () => {
        const updateValue = "upValue";
        const newState = "newState";
        const deliveryId = "ID";
        mockUpdateOne.mockReturnValueOnce(updateValue);
        const e = await updateState(deliveryId,newState);
        expect(e).toBe(updateValue);
        expect(mockUpdateOne).toHaveBeenCalledWith({ _id: deliveryId }, { state: newState });
    });
});

describe("removeOrders function" , ()=>{
    it("should remove oders" ,async ()=>{
        const updateValue = "upValue";
        const ordersId = ["order1" , "order2"];
        const deliveryId = "ID";
        mockUpdateOne.mockReturnValueOnce(updateValue);
        const t =  removeOrders(deliveryId,ordersId)
        expect(t).toBe(updateValue)
        expect(mockUpdateOne).toHaveBeenCalledWith({ _id: deliveryId },  { $pull: { orders: { $in: ordersId } } })
    })
})

describe("deleteDelivery function" , ()=>{
    it("should deleete a delivery" , async()=>{
        const deliveryId = "ID";
        const deleteData = "deleteD"
        mockDeleteOne.mockReturnValueOnce(deleteData)
        const data = await deleteDelivery(deliveryId)
        expect(data).toBe(deleteData)
        expect(mockDeleteOne).toHaveBeenCalledWith({_id : deliveryId})
    })
})
