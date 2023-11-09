
import { v4 as uuidv4 } from "uuid";
import logger from "../logger";




export const setUser = (data: any) => {
  try {
    const { userName, socketId, isBot } = data;
    console.log("cccccccccccccccccc==========>", data);
    return {
      _id: uuidv4(),
      userName: data.userName,
      socketId: socketId,
      isBot: data.isBot,
    };
  } catch (error) {
    logger.error("Error in setUser function:", error);

  }
};




export const setTable = (userData: any) => {
  console.log('tableFormat userData', userData)
  return {
    _id: uuidv4(),
    activePlayer: 0,
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
    playerInfo: [userData],
    status: "waiting",
    playerScore: [0, 0],
    currentTurn: null,
    currentTurnSI: -1,

  };
};


