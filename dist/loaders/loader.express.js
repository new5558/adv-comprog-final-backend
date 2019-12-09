"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var http_errors_1 = __importDefault(require("http-errors"));
exports.default = (function (_a) {
    var app = _a.app;
    app.use(cors_1.default());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded());
    app.use(function (error, _, __, next) {
        if (process.env.NODE_ENV !== "production") {
            console.log(error);
        }
        if (error instanceof SyntaxError) {
            if (error.status === 400 && "body" in error) {
                return next(http_errors_1.default(400, "Bad Request"));
            }
            return next(http_errors_1.default(500, "Internal Server Error"));
        }
        return next();
    });
    return app;
});
