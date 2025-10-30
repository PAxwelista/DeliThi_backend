const ordersMock = require("./ordersMock");

const mockPopulate = jest.fn();
const mockFind = jest.fn().mockReturnValue({
    populate: mockPopulate,
});
const mockUpdateMany = jest.fn();

const mockSave = jest.fn();

const MockOrder = jest.fn(function (data) {
    this.data = data;
    this.save = mockSave;
});

MockOrder.find = mockFind;
MockOrder.updateMany = mockUpdateMany;

jest.mock("../../models/orders", () => MockOrder);

const { getOrders, getAllOrderAreas, getAllOrderAreasObj, createOrder, updateOrdersInfos } = require("../orders");

beforeEach(() => {
    MockOrder.mockClear();
    mockPopulate.mockClear();
    mockFind.mockClear();
    mockSave.mockClear();
});

describe("getOrders function", () => {
    it("should return the orders", async () => {
        const group = "group2";
        const area = "area3";
        const state = "thiState";
        mockPopulate.mockReturnValueOnce(ordersMock);
        const orders = await getOrders(group, { area, state });

        expect(orders).toEqual(ordersMock);
        expect(mockFind).toHaveBeenCalledWith({ group, area, state });
    });
});

describe("getAllOrderAreas function", () => {
    it("should return all areas from orders", async () => {
        const group = "group2";
        mockFind.mockReturnValueOnce(ordersMock);
        const areas = await getAllOrderAreas(group);

        expect(areas).toContain(ordersMock[0].area);
    });
});

describe("getAllOrderAreasObj function", () => {
    it("should return all areas and infos from orders", async () => {
        const group = "group2";
        mockFind.mockReturnValueOnce(ordersMock);
        const areas = await getAllOrderAreasObj(group);

        expect(areas).toEqual([{ name: ordersMock[0].area, nbPending: 2, state: "processing" }]);
    });
});

describe("createOrder function", () => {
    it("should create a new order", async () => {
        value = "try";
        mockSave.mockReturnValueOnce(value);
        const result = await createOrder("z", {});
        expect(result).toBe(value);
        expect(mockSave).toHaveBeenCalledTimes(1);
    });
});

describe("updateOrdersInfos function", () => {
    it("should update orders infos", async () => {
        const sendValue = "val";
        mockUpdateMany.mockReturnValueOnce(sendValue);
        const ordersID = ["2", "4"];
        const updateData = { area: "area4", state: "thisState" };
        const result = await updateOrdersInfos(ordersID, updateData);
        expect(result).toBe(sendValue);
        expect(mockUpdateMany).toHaveBeenCalledWith({ _id: { $in: ordersID } }, updateData);
    });
});
