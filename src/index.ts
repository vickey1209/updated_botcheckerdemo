import express, { Request, Response } from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { EVENT_NAME } from '../src/constants';
import dotenv from 'dotenv';

import { joinGameValidation } from "./validation/requestValidation";
import logger from "./logger";
import socketConnection from "./connection/socketConnection";
import { constants } from "buffer";
dotenv.config({path:'./.env'});
const DATABASE_URL = process.env.DATABASE_URL




const app = express();
const httpServer = http.createServer(app);
const io: Server = new Server(httpServer, {
  cors:
  { origin: "*" },
  transports: ["polling", "websocket"],
  pingInterval: 2000,
  pingTimeout: 2500,
});
socketConnection(); 

app.use(express.static(path.join(__dirname, "./view")));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "./view/game.html"));
});






const port = process.env.SERVER_PORT;
httpServer.listen(port,()=>{
   logger.info(`server is running on port : ${port}`)
})


export  {io}
