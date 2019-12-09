"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var route_auth_1 = __importDefault(require("./routes/route.auth"));
var route_users_1 = __importDefault(require("./routes/route.users"));
var express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
var router = express_1.Router();
router.all("/endpoints", function (_, res) {
    res.status(200).json({
        endpoints: express_list_endpoints_1.default(router)
    });
});
router.get("/", function (_, res) {
    res.status(200).json({ value: "Server works" });
});
route_auth_1.default(router);
route_users_1.default(router);
exports.default = router;
