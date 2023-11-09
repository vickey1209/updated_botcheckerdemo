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
exports.movePieces = void 0;
const redisKey_1 = __importDefault(require("../constants/redisKey"));
const constants_1 = require("../constants");
const redisOperation_1 = require("../redisOperation");
const eventEmitter_1 = __importDefault(require("../eventEmitter"));
const userTurnStarted_1 = require("../playing/userTurnStarted");
// import { checkWinner } from "./checkWinner";
const movePieces = (movedata, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('MOVE_PIECES data :: >>', socket.userId, movedata);
        let movetable = yield (0, redisOperation_1.Get)(`${redisKey_1.default.REDIS_TABLE}:${movedata.data.tableId}`);
        console.log('movetable :: >> ', movetable);
        if (movetable) {
            let signIndex = movetable.playerInfo.findIndex((userObject) => userObject._id == socket.userId);
            console.log('movetable.playerInfo :: >>', movetable.playerInfo);
            console.log('signIndex=----------', signIndex);
            let id = parseInt(movedata.data.id.charAt(1));
            console.log('movetable.playerInfo[signIndex]', movetable.playerInfo[signIndex]);
            movetable.board[id] = movetable.playerInfo[signIndex].sign;
            yield (0, redisOperation_1.Set)(`${redisKey_1.default.REDIS_TABLE}:${movedata.data.tableId}`, movetable);
            let updatetable = yield (0, redisOperation_1.Get)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${movedata.data.tableId}`);
            let previousTurn = null;
            updatetable.playerInfo.forEach((element) => {
                previousTurn = element._id;
            });
            updatetable.currentTurn = previousTurn;
            let tableId = movedata.data.tableId;
            let data = {
                eventName: constants_1.EVENT_NAME.MOVE,
                data: {
                    data: updatetable
                }
            };
            console.log('updatetable :: >>> ', updatetable);
            eventEmitter_1.default.sendToRoom(tableId, data);
            console.log('updatetable.playerInfo ', updatetable.playerInfo[1].isBot);
            yield (0, userTurnStarted_1.userTurnStarted)(tableId);
        }
    }
    catch (error) {
        console.log('movePieces ERROR', error);
    }
});
exports.movePieces = movePieces;
