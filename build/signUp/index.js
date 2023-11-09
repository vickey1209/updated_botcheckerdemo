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
const defaultFormat_1 = require("../defaultFormat");
const redisOperation_1 = require("../redisOperation");
const constants_1 = require("../constants");
const index_1 = __importDefault(require("../eventEmitter/index"));
const botSignUp_1 = require("../bot/botSignUp");
const bull_1 = __importDefault(require("../bull"));
const eventsName_1 = __importDefault(require("../constants/eventsName"));
const signUp = (signupData, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('signUpGame data ::---------- >>', signupData);
        console.log('userName:======>', signupData.data.userName);
        console.log('isBot:', signupData.data.isBot);
        // signupData.socketId = socket.id;
        signupData.data.socketId = socket.id;
        let nextTurn = -1;
        let userDefault = (0, defaultFormat_1.setUser)(signupData.data);
        yield (0, redisOperation_1.Set)(`${constants_1.REDIS_KEY.USER}:${userDefault._id}`, userDefault);
        let getUser = yield (0, redisOperation_1.Get)(`${constants_1.REDIS_KEY.USER}:${userDefault._id}`);
        console.log("getuser=========>>>>", getUser);
        if (getUser) {
            socket.userId = getUser._id;
            let userData = {
                eventName: constants_1.EVENT_NAME.SIGN_UP,
                data: {
                    userId: getUser._id
                }
            };
            index_1.default.sendToSocket(socket.id, userData);
        }
        else {
            console.log("getUser is undefined. Cannot proceed with data.userData");
        }
        let gettableQueue = yield (0, redisOperation_1.Get)(constants_1.REDIS_KEY.REDIS_QUEUE);
        console.log('gettableQueue ', gettableQueue);
        if (gettableQueue && gettableQueue.tableIds && gettableQueue.tableIds.length > 0) {
            console.log('gettableQueue :: >>', gettableQueue.tableIds);
            let table = yield (0, redisOperation_1.Get)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${gettableQueue.tableIds[0]}`);
            // let tableData =await Get(`${REDIS_KEY.REDIS_TABLE}:${signupData.data.tableId}`);
            // let tableData = await Get(`${REDIS_KEY.REDIS_TABLE}:${table}`)
            table.playerInfo.push(getUser);
            table.activePlayer += 1;
            socket.tableId = table._id;
            yield (0, redisOperation_1.Set)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${gettableQueue.tableIds[0]}`, table);
            if (table.activePlayer == table.maxPlayer) {
                console.log('table.activePlayer :: ', table.activePlayer);
                let firstPlayer = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
                nextTurn = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
                bull_1.default.addJob.delayTimer({
                    time: 1000,
                    jobId: table._id,
                    tableId: table._id,
                    currentturn: firstPlayer,
                });
                gettableQueue.tableIds.shift();
                yield (0, redisOperation_1.Set)(constants_1.REDIS_KEY.REDIS_QUEUE, gettableQueue);
                let roomData = {
                    eventName: constants_1.EVENT_NAME.JOIN_GAME,
                    data: {
                        playerInfo: table.playerInfo,
                        userId: getUser._id,
                        board: table.board,
                        tableId: table._id,
                        score: [0, 0],
                        status: "start"
                    }
                };
                index_1.default.sendToRoom(table._id, roomData);
                let roomValidateData = {
                    eventName: constants_1.EVENT_NAME.START_GAME,
                    data: {
                        currentturn: firstPlayer,
                        userid: getUser._id,
                        tableId: table._id,
                    },
                };
                index_1.default.sendToRoom(table._id, roomValidateData);
            }
            else {
                yield (0, botSignUp_1.botSignUp)();
            }
        }
        else {
            let gameTableDefaultFormat = yield (0, defaultFormat_1.setTable)(getUser);
            console.log('gameTableDefaultFormat :: >>', gameTableDefaultFormat);
            gameTableDefaultFormat.activePlayer += 1;
            socket.tableId = gameTableDefaultFormat._id;
            yield (0, redisOperation_1.Set)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${gameTableDefaultFormat === null || gameTableDefaultFormat === void 0 ? void 0 : gameTableDefaultFormat._id}`, gameTableDefaultFormat);
            let board = yield (0, redisOperation_1.Get)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${gameTableDefaultFormat._id}`);
            socket.join(board._id);
            let roomData = {
                eventName: eventsName_1.default.JOIN_GAME,
                data: {
                    playerInfo: board.playerInfo,
                    userId: getUser._id,
                    board: board.board,
                    score: [0, 0],
                    tableId: board._id
                }
            };
            index_1.default.sendToRoom(board._id, roomData);
            let addTableQueue = yield (0, redisOperation_1.Get)(constants_1.REDIS_KEY.REDIS_QUEUE);
            if (!addTableQueue) {
                yield (0, redisOperation_1.Set)(constants_1.REDIS_KEY.REDIS_QUEUE, { tableIds: [board._id] });
            }
            else {
                addTableQueue.tableIds.push(board._id);
                yield (0, redisOperation_1.Set)(constants_1.REDIS_KEY.REDIS_QUEUE, addTableQueue);
            }
            index_1.default.sendToRoom(board._id, roomData);
            if (board.activePlayer != board.maxPlayer) {
                yield (0, botSignUp_1.botSignUp)();
            }
        }
    }
    catch (error) {
        console.log('signUpGame ERROR', error);
    }
});
exports.signUp = signUp;
