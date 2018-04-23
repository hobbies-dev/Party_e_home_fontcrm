function getToken(req) {
    var token = req.body.token || req.headers.token || req.query.token;

    if(token){
        return token;
    }
    else {
        return null;
    }
}

module.exports = getToken;