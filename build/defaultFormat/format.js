"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTable = exports.setUser = void 0;
const uuid_1 = require("uuid");
function setUser(data) {
    try {
        const { userName, socketId, isBot } = data;
        return {
            _id: (0, uuid_1.v4)(),
            userName: userName,
            socketId: socketId,
            isBot: isBot,
        };
    }
    catch (error) {
        console.log('userFormat ERROR', error);
    }
}
exports.setUser = setUser;
// export const setUser = (userName: string, socketId: string ,isBot:string) => {
//   try {
//     return {
//       _id: uuidv4(),
//       userName: userName,
//       socketId: socketId,
//       isBot: isBot, 
//     };
//   } catch (error) {
//     console.error('Error in setUser:', error);
//   }
// };
const setTable = (userData, turnId) => {
    return {
        _id: (0, uuid_1.v4)(),
        activePlayer: 1,
        maxPlayer: 2,
        board: [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
        ],
        player: [userData],
        status: "waiting",
        playerScore: [0, 0],
        turnId: turnId
    };
};
exports.setTable = setTable;
// export { setUser, setTable};
