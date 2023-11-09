
import Event from '../eventEmitter/index';
import { EVENT_NAME, REDIS_KEY } from "../constants";
import { Get, Set } from "../redisOperation";


export const userTurnStarted = async (tableId: any) => {
    const bull = require("../bull");
    try {
        console.log('userTurnStarted is called..');

        let tableData = await Get(`${REDIS_KEY.REDIS_TABLE}:${tableId}`)
        console.log('tableData=-=-=-=-=-=-=-=-=-=-=-=-=-', tableData)

        let nextTurn: any = -1;
        if (tableData.maxPlayer === 2) {
            if (tableData.currentTurnSI === -1) {

                nextTurn = Math.floor(Math.random() * (1 - 0 + 1)) + 0; // Random index
                // tableData.playerInfo[nextTurn].sign = "X";
                // if(nextTurn==0){
                //     tableData.playerInfo[1].sign = "O";
                // }else{
                //     tableData.playerInfo[0].sign = "O";
                // }
                
            } else if (tableData.currentTurnSI === 0) {
                nextTurn = 1
            } else if (tableData.currentTurnSI === 1) {
                nextTurn = 0
            }
        }

        tableData.currentTurn = tableData.playerInfo[nextTurn]._id;
        tableData.currentTurnSI = nextTurn;
        console.log('tableData.currentTurnSI :: >>', tableData.currentTurnSI)
        await Set(`${REDIS_KEY.REDIS_TABLE}:${tableData._id}`, tableData)
        let resTableData: any = {
            eventName: EVENT_NAME.USER_TURN_START,
            data: {
                curretTurn: nextTurn, userId: tableData.currentTurn
            }
        }
        Event.sendToRoom(tableData._id, resTableData)

        if (tableData.playerInfo[nextTurn].isBot)
            bull.addJob.botTurnProcess({
                time: 1000,
                tableData,
                jobId: tableData._id,
            })

    } catch (error) {
        console.log('userTurnStarted ERROR :: >>', error);
    }
}
