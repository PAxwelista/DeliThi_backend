const ordersMock = [
    {
        _id: "4fcf44dbea6a3dd0ec0cf28e",
        customer: {
            _id: "fb224bea97465051dd4bec5a",
            name: "Velva O'Reilly",
            phoneNumber: "+13272117607",
            location: {
                name: "location name",
                area: "Zone 1",
                longitude: 5.1481,
                latitude: 48.7807,
                _id: "68f8d899f535543b143e4aec",
            },
            group: "6877c21e2849078caf344b43",
        },
        state: "processing",
        creationDate: "2026-01-04T03:20:16.300Z",
        deliveryDate: "2025-07-29T09:42:09.251Z",
        orderer: "Axel",
        area: "Zone 1",
        amountPaid: 2,
        products: [
            {
                _id: "5ecbce15e23bfa0a8dfb39aa",
                product: {
                    _id: "6877c62aaed17235608b5510",
                    name: "Tomate",
                    price: 1,
                    group: "6877c21e2849078caf344b43",
                    __v: 0,
                },
                quantity: 2,
            },
        ],
        group: "6877c21e2849078caf344b43",
    },
    {
        _id: "f694ec922d4b88fea19c5bfe",
        customer: {
            _id: "4a9acbbed943a155703b33e4",
            name: "Earl Wehner",
            phoneNumber: "+18322124045",
            location: {
                name: "location name",
                area: "Zone 1",
                longitude: 5.5329,
                latitude: 49.2168,
                _id: "68f8d899f535543b143e4ab1",
            },
            group: "6877c21e2849078caf344b43",
        },
        state: "processing",
        creationDate: "2025-08-21T21:21:09.743Z",
        deliveryDate: "2025-07-29T09:41:23.125Z",
        orderer: "Axel",
        area: "Zone 1",
        amountPaid: 2,
        products: [
            {
                _id: "e3c5f62775f947868be834a3",
                product: {
                    _id: "6877c62aaed17235608b5510",
                    name: "Tomate",
                    price: 1,
                    group: "6877c21e2849078caf344b43",
                    __v: 0,
                },
                quantity: 2,
            },
        ],
        group: "6877c21e2849078caf344b43",
    },
];

module.exports =  ordersMock ;
