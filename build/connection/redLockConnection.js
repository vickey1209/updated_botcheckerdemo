"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redlock_1 = __importDefault(require("redlock"));
const redisConnection_1 = require("./redisConnection");
const redLock = new redlock_1.default([redisConnection_1.redis], {
    driftFactor: 0.01,
    retryCount: 10,
    retryJitter: 200,
    automaticExtensionThreshold: 500,
});
exports.default = redLock;
