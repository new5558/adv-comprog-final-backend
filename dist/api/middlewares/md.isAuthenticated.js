"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var http_errors_1 = __importDefault(require("http-errors"));
var getTokenFromHeader = function (req) {
    if (req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer") {
        return req.headers.authorization.split(" ")[1];
    }
};
exports.default = (function (req, _, next) {
    var token = getTokenFromHeader(req);
    if (token) {
        try {
            var decodedUser = jsonwebtoken_1.default.verify(token, process.env.SECRET);
            req.decodedUser = decodedUser;
            return next();
        }
        catch (_a) {
            return next(http_errors_1.default(401, "Unauthorized"));
        }
    }
    return next(http_errors_1.default(401, "Unauthorized"));
});
