"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = __importStar(require("express"));
var md_isAuthenticated_1 = __importDefault(require("../middlewares/md.isAuthenticated"));
var md_attachCurrentUser_1 = __importDefault(require("../middlewares/md.attachCurrentUser"));
var router = express.Router();
exports.default = (function (app) {
    app.use("/user", router);
    router.get("/", md_isAuthenticated_1.default, md_attachCurrentUser_1.default, function (req, res) {
        res.status(200).json(req.currentUser);
    });
});
