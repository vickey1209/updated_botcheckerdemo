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
exports.botTurn = void 0;
const botTurn = (turndata) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('botTurn data :: >>', turndata.currentTurnSI);
        let isBot = turndata.playerInfo[turndata.currentTurnSI].isBot;
        console.log('isBot :: >>', isBot);
        let board = turndata.board;
        let empltyindex = [];
        if (isBot) {
            board.forEach((element, index) => {
                if (element == null) {
                    empltyindex.push(index);
                }
            });
            console.log('emptyindex :: >>', empltyindex);
            let botSign = turndata.playerInfo[turndata.currentTurnSI].sign;
            console.log('botSign :: >>', botSign);
            if (isBot) {
                board.forEach((element, index) => {
                    if (element == null) {
                        empltyindex.push(index);
                    }
                });
                console.log('empltyindex :: >>', empltyindex);
                let botSign = turndata.playerInfo[turndata.currentTurnSI].sign;
                console.log('botSign :: >>', botSign);
                let oppoSign = "";
                if (botSign === "X")
                    oppoSign = "O";
                else
                    oppoSign = "X";
                console.log('player name :: >>', turndata.playerInfo[turndata.currentTurnSI].playerName);
                let moveData = {
                    eventName: 'MOVE',
                    data: {
                        name: turndata.playerInfo[turndata.currentTurnSI].playerName,
                        tableId: turndata._id
                    }
                };
                //movePieces(moveData, { id: "bot", userId: turndata.playerInfo[turndata.currentTurnSI]._id, tableId: turndata._id })
            }
        }
    }
    catch (error) {
        console.log('botTurn ERROR :: >>', error);
    }
});
exports.botTurn = botTurn;
