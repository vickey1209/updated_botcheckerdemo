"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS_KEY = exports.EVENT_NAME = exports.BULL_KEY = void 0;
const bullKey_1 = __importDefault(require("./bullKey"));
exports.BULL_KEY = bullKey_1.default;
const eventsName_1 = __importDefault(require("./eventsName"));
exports.EVENT_NAME = eventsName_1.default;
const redisKey_1 = __importDefault(require("./redisKey"));
exports.REDIS_KEY = redisKey_1.default;
