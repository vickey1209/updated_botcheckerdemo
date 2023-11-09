"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reJointable = void 0;
const constants_1 = require("../constants");
const redisOperation_1 = require("../redisOperation");
const eventEmitter_1 = __importDefault(require("../eventEmitter"));
const reJointable = (reJoinData, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = reJoinData.userId;
        let tableId = reJoinData.tableId;
        if (userId && tableId) {
            let user = yield (0, redisOperation_1.Get)(`${constants_1.REDIS_KEY.USER}:${userId}`);
            let table = yield (0, redisOperation_1.Get)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${tableId}`);
            table.status = 'start';
            socket.join(table._id);
            socket.userId = userId;
            socket.tableId = tableId;
            let roomData = {
                eventName: constants_1.EVENT_NAME.JOIN_GAME,
                data: {
                    playerInfo: table.playerInfo,
                    userId: userId,
                    board: table.board,
                    tableId: table._id
                }
            };
            eventEmitter_1.default.sendToRoom(table._id, roomData);
            let resTableData = {
                eventName: constants_1.EVENT_NAME.USER_TURN_START,
                data: {
                    curretTurn: table.currentTurn, userId: userId
                }
            };
            eventEmitter_1.default.sendToRoom(table._id, resTableData);
        }
    }
    catch (error) {
        console.log('reJointable ERROR :: >>', error);
    }
});
exports.reJointable = reJointable;
