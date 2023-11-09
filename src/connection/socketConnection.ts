import { Socket } from 'socket.io';
import {io} from '..';
import {createAdapter} from 'socket.io-redis';
import logger from '../logger';
import socketId from "../eventEmitter/index"

import { redisPub, redisSub } from './redisConnection';
import handleEvent from '../eventHandler';
import { disconnect } from '../playing';
import { disconnectQueue } from '../bull/queue/disconnectDelay';
import { log } from 'console';


const socketIoConnection=()=>{
    io.adapter(createAdapter(redisPub,redisSub));
    io.on('connection',async(socket:any)=>{
        const socketId = socket.id;
        logger.info(`New connection with socket ID: ${socketId}`);
        logger.info('socket.io connected succesfully')
        
       await handleEvent(socket);
       socket.on('disconnect',async()=>{
        await disconnectQueue(socket.tableId);
        
       })
       
    })
    
    

}


export default socketIoConnection;