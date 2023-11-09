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
// import { redis } from "../../connection/redisConnection";
const bull_1 = __importDefault(require("bull"));
const bullKey_1 = __importDefault(require("../../constants/bullKey"));
const botTurn_1 = require("../../bot/botTurn");
const botTurnProcess = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('bot turn process called', data);
        let roundQueue = new bull_1.default(bullKey_1.default.TURN_DELAY_QUEUE);
        let options = {
            delay: data.time,
            jobId: data.jobId,
            removeOnComplete: true
        };
        yield roundQueue.add(data, options);
        roundQueue.process((job) => __awaiter(void 0, void 0, void 0, function* () {
            // console.log('process time ',new Date())
            console.log('Bot turn function run now 0000000');
            (0, botTurn_1.botTurn)(job.data.tableData);
        }));
    }
    catch (error) {
        console.log('botTurnProcess ERROR', error);
    }
});
exports.default = botTurnProcess;
