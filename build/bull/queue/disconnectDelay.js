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
exports.disconnectQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const dotenv_1 = __importDefault(require("dotenv"));
const constants_1 = require("../../constants");
const logger_1 = __importDefault(require("../../logger"));
dotenv_1.default.config({ path: '../../../.env' });
function disconnectQueue(tableId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (tableId) {
                let redisOption = {
                    port: process.env.REDIS_PORT,
                    host: process.env.REDIS_HOST,
                    db: process.env.REDIS_DB
                };
                let disconnectDelayQueue = new bull_1.default(constants_1.BULL_KEY.DISCONNECT_DELAY_QUEUE, { redis: redisOption });
                let options = {
                    delay: 2000,
                    attempts: 1,
                    job_id: tableId
                };
                yield disconnectDelayQueue.add(tableId, options);
                yield disconnectDelayQueue.process((job) => __awaiter(this, void 0, void 0, function* () {
                    console.log('job', job);
                    // await disconnect(job.tableId);
                }));
            }
        }
        catch (error) {
            logger_1.default.error(`CATCH ERROR IN disconnectQueue : ${error}`);
        }
    });
}
exports.disconnectQueue = disconnectQueue;
