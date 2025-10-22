const combineProducts = (products)=>{
    return products.reduce((a, { name, quantity }) => {
        const existing = a.find(item => item.name === name);
        existing ? (existing.quantity += quantity) : a.push({ name, quantity });
        return a;
    }, []);
}


module.exports = {combineProducts}