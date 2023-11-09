"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveTable = exports.move = exports.checkPOssibility = exports.disconnect = exports.joinGame = void 0;
const joinGame_1 = __importDefault(require("./joinGame"));
exports.joinGame = joinGame_1.default;
const disconnect_1 = __importDefault(require("./disconnect"));
exports.disconnect = disconnect_1.default;
const checkPossibility_1 = __importDefault(require("./checkPossibility"));
exports.checkPOssibility = checkPossibility_1.default;
const move_1 = __importDefault(require("./move"));
exports.move = move_1.default;
const leaveTable_1 = require("./leaveTable");
Object.defineProperty(exports, "leaveTable", { enumerable: true, get: function () { return leaveTable_1.leaveTable; } });
