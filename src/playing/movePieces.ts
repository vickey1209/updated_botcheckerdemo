import rediskeys from "../constants/redisKey";
import { EVENT_NAME, REDIS_KEY } from "../constants";
import { Get, Set } from "../redisOperation";
import Event from "../eventEmitter";

import { userTurnStarted } from '../playing/userTurnStarted';
// import { checkWinner } from "./checkWinner";

const movePieces = async (movedata:any, socket:any) => {
    try {
        console.log('MOVE_PIECES data :: >>', socket.userId, movedata);

        let movetable = await Get(`${rediskeys.REDIS_TABLE}:${movedata.data.tableId}`);
        console.log('movetable :: >> ', movetable);

        if (movetable) {
            let signIndex = movetable.playerInfo.findIndex((userObject:any) => userObject._id == socket.userId);
            console.log('movetable.playerInfo :: >>', movetable.playerInfo);
            console.log('signIndex=----------', signIndex);

            let id = parseInt(movedata.data.id.charAt(1));
            console.log('movetable.playerInfo[signIndex]', movetable.playerInfo[signIndex]);
            movetable.board[id] = movetable.playerInfo[signIndex].sign;

            await Set(`${rediskeys.REDIS_TABLE}:${movedata.data.tableId}`, movetable);

            let updatetable = await Get(`${REDIS_KEY.REDIS_TABLE}:${movedata.data.tableId}`);
            let previousTurn = null;

            updatetable.playerInfo.forEach((element:any) => {
                previousTurn = element._id;
            });

            updatetable.currentTurn = previousTurn;
            let tableId = movedata.data.tableId;
            let data = {
                eventName: EVENT_NAME.MOVE,
                data: {
                    data: updatetable
                }
            };

            console.log('updatetable :: >>> ', updatetable);
            Event.sendToRoom(tableId, data);
            console.log('updatetable.playerInfo ', updatetable.playerInfo[1].isBot);

          
                await userTurnStarted(tableId);
         
        }
    } catch (error) {
        console.log('movePieces ERROR', error);
    }
};

export { movePieces };
