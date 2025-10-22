const deliveriesMock = [
    {
        _id: "68f7751756d71f62e0898e4c",
        orders: [
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
                        _id: "68f897ccdec1f2734c50867a",
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
                        quantity: 5,
                    },
                    {
                        _id: "5ecbce25e23bfa0a8dfb39aa",
                        product: {
                            _id: "6877c62aaed17235608b5510",
                            name: "Tomate",
                            price: 1,
                            group: "6877c21e2849078caf344b43",
                            __v: 0,
                        },
                        quantity: 2,
                    },
                    {
                        _id: "5ecbce15e23bfa028dfb39aa",
                        product: {
                            _id: "6877c62a2ed17235608b5510",
                            name: "Pomme",
                            price: 1,
                            group: "6877c21e2849078caf344b43",
                            __v: 0,
                        },
                        quantity: 2,
                    },
                ],
                group: "6877c21e2849078caf344b43",
            },
        ],
        deliveryDate: "2025-10-21T11:57:11.512Z",
        state: "processing",
        group: "6877c21e2849078caf344b43",
        __v: 0,
    },
    {
        _id: "68f7751b56d71f62e0898eac",
        orders: [
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
                        _id: "68f897ccdec1f2734c50867a",
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
        ],
        deliveryDate: "2025-10-21T11:57:15.896Z",
        state: "finished",
        group: "6877c21e2849078caf344b43",
    },
];

module.exports = deliveriesMock