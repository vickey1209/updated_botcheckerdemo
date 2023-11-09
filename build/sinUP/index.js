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
exports.signUp = void 0;
const constants_1 = require("../constants");
const eventEmitter_1 = __importDefault(require("../eventEmitter"));
const playing_1 = require("../playing");
const redisOperation_1 = require("../redisOperation");
function signUp(data, socket) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("data", data);
        if (data.data.userId && data.data.tableId) {
            let userData = yield (0, redisOperation_1.Get)(`${constants_1.REDIS_KEY.USER}:${data.data.userId}`);
            userData.socketId = (socket.id) ? socket.id : null;
            yield (0, redisOperation_1.Set)(`${constants_1.REDIS_KEY.USER}:${data.data.userId}`, userData);
            let tableData = yield (0, redisOperation_1.Get)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${data.data.tableId}`);
            socket.join(tableData._id);
            socket.tableId = tableData._id;
            let sinUPData = {
                eventName: constants_1.EVENT_NAME.SIGN_UP,
                data: {
                    userId: userData._id
                }
            };
            eventEmitter_1.default.sendToSocket(socket.id, sinUPData);
            let sendUserData = {
                eventName: constants_1.EVENT_NAME.JOIN_GAME,
                data: {
                    userData: tableData.player,
                    tableId: tableData._id,
                    board: tableData.board,
                    score: [0, 0],
                    status: "start",
                },
            };
            eventEmitter_1.default.sendToRoom(tableData._id, sendUserData);
            let userTurnStartData = {
                eventName: constants_1.EVENT_NAME.USER_TURN_START,
                data: {
                    userId: tableData.turnId,
                }
            };
            eventEmitter_1.default.sendToRoom(tableData._id, userTurnStartData);
        }
        else {
            (0, playing_1.joinGame)(data, socket);
        }
    });
}
exports.signUp = signUp;
