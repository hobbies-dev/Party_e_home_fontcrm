var jwt = require('express-jwt');
const users = require('../../database/model/users')

var isRevokedCallback = function(req, payload, done){
    var issuer = payload.iss;
    var tokenId = payload.jti;

    users.getRevokedToken(issuer, tokenId, function(err, token){
        if (err) { return done(err); }
        return done(null, !!token);
    });
};

module.exports = isRevokedCallback

