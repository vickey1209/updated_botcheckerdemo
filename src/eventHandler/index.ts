import { Socket } from "socket.io";
import logger from "../logger";
import { EVENT_NAME } from "../constants";
import { reJointable } from "../playing/reJointable";
import {checkPOssibility, joinGame, leaveTable, move} from "../playing/";
import { signUp } from "../signUp";
 
const handleEvent=(socket:Socket)=>{
    socket.onAny((eventName:string,data:any)=>{
        console.log('eventHandle data :: >>', data)
        // console.log('eventName', eventName)
        logger.info(`REQUEST EVENT NAME: ${eventName} : REQUEST DATA : ${JSON.stringify(data.data)}`);
        switch(eventName){
            case EVENT_NAME.SIGN_UP:
                signUp(data,socket);
            break;
            case EVENT_NAME.JOIN_GAME:
                joinGame(data,socket);
            case EVENT_NAME.CHECK_POSSIBILITY:
                checkPOssibility(data,socket);
            break;
            case EVENT_NAME.MOVE:   
                move(data,socket);
            break;
            case EVENT_NAME.LEAVE:
                leaveTable(data.data,socket);
            break;
            case EVENT_NAME.REJOIN:
                reJointable(data.data, socket);
                break;
        }
    })
}
export default handleEvent;