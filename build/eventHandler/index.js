"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
const constants_1 = require("../constants");
const reJointable_1 = require("../playing/reJointable");
const playing_1 = require("../playing/");
const signUp_1 = require("../signUp");
const handleEvent = (socket) => {
    socket.onAny((eventName, data) => {
        console.log('eventHandle data :: >>', data);
        // console.log('eventName', eventName)
        logger_1.default.info(`REQUEST EVENT NAME: ${eventName} : REQUEST DATA : ${JSON.stringify(data.data)}`);
        switch (eventName) {
            case constants_1.EVENT_NAME.SIGN_UP:
                (0, signUp_1.signUp)(data, socket);
                break;
            case constants_1.EVENT_NAME.JOIN_GAME:
                (0, playing_1.joinGame)(data, socket);
            case constants_1.EVENT_NAME.CHECK_POSSIBILITY:
                (0, playing_1.checkPOssibility)(data, socket);
                break;
            case constants_1.EVENT_NAME.MOVE:
                (0, playing_1.move)(data, socket);
                break;
            case constants_1.EVENT_NAME.LEAVE:
                (0, playing_1.leaveTable)(data.data, socket);
                break;
            case constants_1.EVENT_NAME.REJOIN:
                (0, reJointable_1.reJointable)(data.data, socket);
                break;
        }
    });
};
exports.default = handleEvent;
