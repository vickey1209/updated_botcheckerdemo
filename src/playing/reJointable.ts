import { EVENT_NAME, REDIS_KEY } from "../constants";
import { Get } from "../redisOperation";
import Events from '../eventEmitter';

const reJointable = async (reJoinData: any, socket: any) => {
    try {
        let userId = reJoinData.userId
        let tableId = reJoinData.tableId
        if (userId && tableId) {
            let user = await Get(`${REDIS_KEY.USER}:${userId}`)
            let table = await Get(`${REDIS_KEY.REDIS_TABLE}:${tableId}`)
            table.status='start'
            socket.join(table._id)
            socket.userId = userId
            socket.tableId = tableId
            let roomData: any = {
                eventName: EVENT_NAME.JOIN_GAME,
                data: {
                    playerInfo: table.playerInfo,
                    userId: userId,
                    board: table.board,
                    tableId: table._id
                }
            }

         
            Events.sendToRoom(table._id, roomData)

         

            let resTableData: any = {
                eventName: EVENT_NAME.USER_TURN_START,
                data: {
                    curretTurn: table.currentTurn, userId: userId
                }
            }
            Events.sendToRoom(table._id, resTableData)
        }
    } catch (error) {
        console.log('reJointable ERROR :: >>', error);
    }
}

export { reJointable }
