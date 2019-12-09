"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var user_1 = __importDefault(require("../models/user"));
var typedi_1 = require("typedi");
var http_errors_1 = __importDefault(require("http-errors"));
var AuthService = /** @class */ (function () {
    function AuthService() {
    }
    AuthService.prototype.signup = function (userInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var username, password, name, role, userRecord, salt, passwordHashed, userRecord_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        username = userInfo.username, password = userInfo.password, name = userInfo.name, role = userInfo.role;
                        return [4 /*yield*/, user_1.default.findOne({ username: username })];
                    case 1:
                        userRecord = _a.sent();
                        if (userRecord) {
                            return [2 /*return*/, http_errors_1.default(409, "User already exists")];
                        }
                        salt = bcryptjs_1.default.genSaltSync(10);
                        passwordHashed = bcryptjs_1.default.hashSync(password, salt);
                        return [4 /*yield*/, user_1.default.create({
                                password: passwordHashed,
                                username: username,
                                role: role,
                                salt: salt,
                                name: name
                            })];
                    case 2:
                        userRecord_1 = _a.sent();
                        return [4 /*yield*/, userRecord_1.save()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, {
                                user: {
                                    email: userRecord_1.username,
                                    name: userRecord_1.name,
                                    role: userRecord_1.role,
                                    _id: userRecord_1._id
                                }
                            }];
                }
            });
        });
    };
    AuthService.prototype.login = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var userRecord, isPasswordValid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_1.default.findOne({ username: username })];
                    case 1:
                        userRecord = _a.sent();
                        if (!userRecord) {
                            return [2 /*return*/, http_errors_1.default(404, "User not found")];
                        }
                        isPasswordValid = bcryptjs_1.default.compareSync(password, userRecord.password);
                        if (!isPasswordValid) {
                            return [2 /*return*/, http_errors_1.default(401, "Incorrect password")];
                        }
                        return [2 /*return*/, {
                                user: {
                                    username: userRecord.username,
                                    name: userRecord.name,
                                    role: userRecord.role
                                },
                                token: this.generateJWT(userRecord)
                            }];
                }
            });
        });
    };
    AuthService.prototype.generateJWT = function (user) {
        var data = {
            _id: user._id,
            name: user.name,
            username: user.username
        };
        var signature = process.env.SECRET;
        var expiration = "2h";
        return jsonwebtoken_1.default.sign({ data: data }, signature, { expiresIn: expiration });
    };
    AuthService = __decorate([
        typedi_1.Service(),
        __metadata("design:paramtypes", [])
    ], AuthService);
    return AuthService;
}());
exports.default = AuthService;
