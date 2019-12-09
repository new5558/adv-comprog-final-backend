"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var check_1 = require("express-validator/check");
var http_errors_1 = __importDefault(require("http-errors"));
exports.default = (function (req, _, next) {
    var validationErrors = check_1.validationResult(req).formatWith(function (_a) {
        var location = _a.location, msg = _a.msg, param = _a.param, nestedErrors = _a.nestedErrors;
        return { location: location, msg: msg, param: param, nestedErrors: nestedErrors };
    });
    if (!validationErrors.isEmpty()) {
        return next(http_errors_1.default(422, { errors: validationErrors.array() }));
    }
    return next();
});
