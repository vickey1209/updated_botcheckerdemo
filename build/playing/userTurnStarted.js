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
exports.userTurnStarted = void 0;
const index_1 = __importDefault(require("../eventEmitter/index"));
const constants_1 = require("../constants");
const redisOperation_1 = require("../redisOperation");
const userTurnStarted = (tableId) => __awaiter(void 0, void 0, void 0, function* () {
    const bull = require("../bull");
    try {
        console.log('userTurnStarted is called..');
        let tableData = yield (0, redisOperation_1.Get)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${tableId}`);
        console.log('tableData=-=-=-=-=-=-=-=-=-=-=-=-=-', tableData);
        let nextTurn = -1;
        if (tableData.maxPlayer === 2) {
            if (tableData.currentTurnSI === -1) {
                nextTurn = Math.floor(Math.random() * (1 - 0 + 1)) + 0; // Random index
                // tableData.playerInfo[nextTurn].sign = "X";
                // if(nextTurn==0){
                //     tableData.playerInfo[1].sign = "O";
                // }else{
                //     tableData.playerInfo[0].sign = "O";
                // }
            }
            else if (tableData.currentTurnSI === 0) {
                nextTurn = 1;
            }
            else if (tableData.currentTurnSI === 1) {
                nextTurn = 0;
            }
        }
        tableData.currentTurn = tableData.playerInfo[nextTurn]._id;
        tableData.currentTurnSI = nextTurn;
        console.log('tableData.currentTurnSI :: >>', tableData.currentTurnSI);
        yield (0, redisOperation_1.Set)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${tableData._id}`, tableData);
        let resTableData = {
            eventName: constants_1.EVENT_NAME.USER_TURN_START,
            data: {
                curretTurn: nextTurn, userId: tableData.currentTurn
            }
        };
        index_1.default.sendToRoom(tableData._id, resTableData);
        if (tableData.playerInfo[nextTurn].isBot)
            bull.addJob.botTurnProcess({
                time: 1000,
                tableData,
                jobId: tableData._id,
            });
    }
    catch (error) {
        console.log('userTurnStarted ERROR :: >>', error);
    }
});
exports.userTurnStarted = userTurnStarted;
