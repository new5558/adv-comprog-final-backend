"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
exports.default = (function (_a) {
    var app = _a.app;
    app.use(cors_1.default());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded());
    return app;
});
