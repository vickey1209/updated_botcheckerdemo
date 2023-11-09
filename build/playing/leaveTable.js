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
exports.leaveTable = void 0;
const constants_1 = require("../constants");
const logger_1 = __importDefault(require("../logger"));
const redisOperation_1 = require("../redisOperation");
const _1 = require(".");
const eventEmitter_1 = __importDefault(require("../eventEmitter"));
function leaveTable(data, socket) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('data', data);
            let tableData = yield (0, redisOperation_1.Get)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${socket.tableId}`);
            console.log('tableData', tableData);
            if (tableData) {
                let winData = {
                    eventName: constants_1.EVENT_NAME.WIN,
                    data: {
                        winnerId: (tableData.player[1]._id == data.userId) ? tableData.player[0]._id : tableData.player[1]._id
                    }
                };
                eventEmitter_1.default.sendToRoom(tableData._id, winData);
                (0, _1.disconnect)(socket.tableId);
                console.log("players win data", tableData);
            }
        }
        catch (error) {
            logger_1.default.error(`CATCH ERROR IN liveTable : ${error}`);
        }
    });
}
exports.leaveTable = leaveTable;
