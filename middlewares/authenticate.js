const { HttpError, verifyToken } = require('../helpers');
const { User } = require('../models/user');

const authenticate = async (req, res, next) => {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');
    if (bearer !== "Bearer") {
        next(HttpError(401))
    }
try {
    const {payload} = verifyToken(token);
    const user = await User.findById(payload.id);
    console.log(user)
    if (!user || !user.token || user.token !== token) {
        next(HttpError(401, "User not found"))
    }
    req.user = user;
    next();
} catch{
    next(HttpError(401))
}
}


module.exports = authenticate;