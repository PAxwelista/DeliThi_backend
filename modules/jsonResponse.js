const jsonResponse = (res,{ result = true, key = "data", data = null, error = null, code = 200 }) => {
    const response = { result };

    if (data) {
        response[key] = data;
    }

    if (error) {
        response.error = error;
    }
    
    return res.status(code).json(response) 
};

module.exports = { jsonResponse };
