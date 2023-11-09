import { setTable, setUser } from "../defaultFormat";
import { Get, Set } from "../redisOperation";
import { EVENT_NAME, REDIS_KEY } from "../constants";
import Event from '../eventEmitter/index';
import { botSignUp } from "../bot/botSignUp";
import bull from "../bull";
import eventName from "../constants/eventsName";


const signUp = async (signupData:any, socket:any) => {
    try {
        console.log('signUpGame data ::---------- >>', signupData);

        console.log('userName:======>', signupData.data.userName);
        console.log('isBot:', signupData.data.isBot);
        // signupData.socketId = socket.id;
        signupData.data.socketId = socket.id;
        let nextTurn: any = -1;
        let userDefault: any = setUser(signupData.data);
        await Set(`${REDIS_KEY.USER}:${userDefault._id}`, userDefault);
        let getUser = await Get(`${REDIS_KEY.USER}:${userDefault._id}`);
        console.log("getuser=========>>>>", getUser);
        
        if (getUser) {
            socket.userId = getUser._id;
            let userData: any = {
                eventName: EVENT_NAME.SIGN_UP,
                data: {
                    userId: getUser._id
                }
            };
            Event.sendToSocket(socket.id, userData);
        } else {
            console.log("getUser is undefined. Cannot proceed with data.userData");
        }

        let gettableQueue = await Get(REDIS_KEY.REDIS_QUEUE);
        console.log('gettableQueue ', gettableQueue);
        if (gettableQueue && gettableQueue.tableIds && gettableQueue.tableIds.length > 0) {
            console.log('gettableQueue :: >>', gettableQueue.tableIds);
            let table = await Get(`${REDIS_KEY.REDIS_TABLE}:${gettableQueue.tableIds[0]}`);
            // let tableData =await Get(`${REDIS_KEY.REDIS_TABLE}:${signupData.data.tableId}`);
            // let tableData = await Get(`${REDIS_KEY.REDIS_TABLE}:${table}`)
            table.playerInfo.push(getUser);
            table.activePlayer += 1;
            socket.tableId = table._id;
            await Set(`${REDIS_KEY.REDIS_TABLE}:${gettableQueue.tableIds[0]}`, table);

            if (table.activePlayer == table.maxPlayer) {
                console.log('table.activePlayer :: ', table.activePlayer);

                let firstPlayer = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
                nextTurn = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
                bull.addJob.delayTimer({
                    time: 1000,
                    jobId: table._id,
                    tableId: table._id,
                    currentturn: firstPlayer,
                  
                });

                gettableQueue.tableIds.shift();
                await Set(REDIS_KEY.REDIS_QUEUE, gettableQueue);

                let roomData = {
                    eventName: EVENT_NAME.JOIN_GAME,
                    data: {
                        playerInfo: table.playerInfo,
                        userId: getUser._id,
                        board: table.board,
                        tableId: table._id,
                        score:[0,0],
                        status: "start"
                    }
                };
                Event.sendToRoom(table._id, roomData);

                let roomValidateData = {
                    eventName: EVENT_NAME.START_GAME,
                    data: {
                        currentturn: firstPlayer,
                        userid:getUser._id,
                        tableId: table._id,
                
                        
                    },
                    
                    
                };
                Event.sendToRoom(table._id, roomValidateData);

                
            } else {
                await botSignUp();
            }
        } else {
            let gameTableDefaultFormat = await setTable(getUser) 
            console.log('gameTableDefaultFormat :: >>', gameTableDefaultFormat);
            gameTableDefaultFormat.activePlayer += 1;
            socket.tableId = gameTableDefaultFormat._id;
            await Set(`${REDIS_KEY.REDIS_TABLE}:${gameTableDefaultFormat?._id}`, gameTableDefaultFormat);
            let board = await Get(`${REDIS_KEY.REDIS_TABLE}:${gameTableDefaultFormat._id}`);
            
            socket.join(board._id);

            let roomData: any = {
                eventName: eventName.JOIN_GAME,
                data: {
                    playerInfo: board.playerInfo,
                    userId: getUser._id,
                    board: board.board,
                    score:[0,0],
                    tableId: board._id
                }
            };
            Event.sendToRoom(board._id, roomData);
            
       

            let addTableQueue = await Get(REDIS_KEY.REDIS_QUEUE);
            if (!addTableQueue) {
                await Set(REDIS_KEY.REDIS_QUEUE, { tableIds: [board._id] });
            } else {
                addTableQueue.tableIds.push(board._id);
                await Set(REDIS_KEY.REDIS_QUEUE, addTableQueue);
            }
            Event.sendToRoom(board._id, roomData);
            if (board.activePlayer != board.maxPlayer) {
                await botSignUp();
            }
        }
    } catch (error) {
        console.log('signUpGame ERROR', error);
    }
}

export { signUp }




