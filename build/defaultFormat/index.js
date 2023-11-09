"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTable = exports.setUser = void 0;
const uuid_1 = require("uuid");
const logger_1 = __importDefault(require("../logger"));
const setUser = (data) => {
    try {
        const { userName, socketId, isBot } = data;
        console.log("cccccccccccccccccc==========>", data);
        return {
            _id: (0, uuid_1.v4)(),
            userName: data.userName,
            socketId: socketId,
            isBot: data.isBot,
        };
    }
    catch (error) {
        logger_1.default.error("Error in setUser function:", error);
    }
};
exports.setUser = setUser;
const setTable = (userData) => {
    console.log('tableFormat userData', userData);
    return {
        _id: (0, uuid_1.v4)(),
        activePlayer: 0,
        maxPlayer: 2,
        board: [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
        ],
        playerInfo: [userData],
        status: "waiting",
        playerScore: [0, 0],
        currentTurn: null,
        currentTurnSI: -1,
    };
};
exports.setTable = setTable;
