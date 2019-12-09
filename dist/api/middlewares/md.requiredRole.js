"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_errors_1 = __importDefault(require("http-errors"));
exports.default = (function (role) { return function (req, _, next) {
    var currentUser = req.currentUser;
    if (currentUser && currentUser.role == role) {
        return next();
    }
    return next(http_errors_1.default(401, "Action not allowed"));
}; });
