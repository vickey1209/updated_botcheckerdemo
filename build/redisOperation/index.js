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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Del = exports.Set = exports.Get = void 0;
const redisConnection_1 = require("../connection/redisConnection");
const Get = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('key=================', key);
        let data = yield redisConnection_1.redis.get(key);
        console.log('redis getData', data);
        data = (data) ? JSON.parse(data) : null;
        if (data) {
            return data;
        }
        else {
            return false;
        }
    }
    catch (error) {
        console.error(`Error in Get function: ${error}`);
        return null;
    }
});
exports.Get = Get;
// const Set = async (key: string, data: any) => {
//     try {
//         return await redis.set(key, JSON.stringify(data));
//     } catch (error) {
//         console.error(`Error in Set function: ${error}`);
//         return false; 
//     }
// };
const Set = (key, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('set data ================>>', data);
        return yield redisConnection_1.redis.set(key, JSON.stringify(data));
    }
    catch (error) {
        console.log('redis operation set ERROR', error);
    }
});
exports.Set = Set;
const Del = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield redisConnection_1.redis.del(key);
    }
    catch (error) {
        console.error(`Error in Del function: ${error}`);
        return false;
    }
});
exports.Del = Del;
