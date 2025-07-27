const createCodeAndExpireDate = () => {
    
    const code = Math.floor(100000 + Math.random() * 900000);

    const createdAt = Date.now();

    const expiresAt = createdAt + 10 * 60 * 1000;

    return { code, createdAt, expiresAt };
};

module.exports = { createCodeAndExpireDate };
