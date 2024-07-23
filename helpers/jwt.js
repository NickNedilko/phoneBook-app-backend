const jwt = require("jsonwebtoken");

const { SECRET_KEY_TOKEN } = process.env;


const createToken = (payload) =>  jwt.sign(payload, SECRET_KEY_TOKEN, { expiresIn: "23h" })
    


const verifyToken = token => {
    try {
       const payload = jwt.verify(token, SECRET_KEY_TOKEN);
       return {error: null, payload};
    }
    catch(error) {
        return {error, payload: null};
    }
};


module.exports = {
    createToken,
    verifyToken
};