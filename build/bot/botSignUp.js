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
exports.botSignUp = void 0;
const index_1 = require("../signUp/index");
// import { SignUpInterface } from "../interface/otherInterface";
function botSignUp() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("bot sign up called ..");
            let botData = {
                eventName: "SIGN_UP", data: {
                    userName: "Bot",
                    isBot: true,
                }
            };
            console.log("botdata======>.", botData);
            let fakeSocket = {
                id: "fakeSocketId"
            };
            yield (0, index_1.signUp)(botData, fakeSocket);
        }
        catch (error) {
            console.log('botSignUp ERROR :: >>', error);
        }
    });
}
exports.botSignUp = botSignUp;
