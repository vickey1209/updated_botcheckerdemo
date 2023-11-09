"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const __1 = require("..");
const logger_1 = __importDefault(require("../logger"));
class Event {
    sendToSocket(socketId, data) {
        logger_1.default.info(`sendToSocket : RESPONSE EVENT NAME : ${data.eventName} : RESPONSE DATA : ${JSON.stringify(data.data)}`);
        __1.io.to(socketId).emit(data.eventName, data);
        logger_1.default.info("socket id :-", socketId);
    }
    sendToRoom(tableId, data) {
        console.log('sendToRoom data :: >>', data);
        console.log('sendToRoom tableId :: >>', tableId);
        logger_1.default.info(`sendToRoom : RESPONSE EVENT NAME : ${data.eventName} : RESPONSE DATA : ${JSON.stringify(data.data)}`);
        __1.io.to(tableId).emit(data.eventName, data);
    }
}
module.exports = new Event();
