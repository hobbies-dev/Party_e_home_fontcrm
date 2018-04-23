const jwt = require("express-jwt");
const tokenConfig = require("./tokenConfig");
const getToken = require("../controller/function/verifyToken");

module.exports = jwt({
    secret:tokenConfig.secret,
    getToken
})
