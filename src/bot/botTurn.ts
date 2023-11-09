

export const botTurn = async (turndata: any): Promise<void> => {
    try {
        console.log('botTurn data :: >>', turndata.currentTurnSI)
        let isBot = turndata.playerInfo[turndata.currentTurnSI].isBot
        console.log('isBot :: >>', isBot)
        let board = turndata.board

        let empltyindex: number[] = []

        if (isBot) {
            board.forEach((element: any, index: any) => {
                if (element == null) {
                    empltyindex.push(index)
                }
            })
            console.log('emptyindex :: >>', empltyindex)

            let botSign = turndata.playerInfo[turndata.currentTurnSI].sign;
            console.log('botSign :: >>', botSign)


            if (isBot) {
                board.forEach((element: any, index: any) => {
                    if (element == null) {
                        empltyindex.push(index)
                    }
                })
                console.log('empltyindex :: >>', empltyindex)
    
                let botSign = turndata.playerInfo[turndata.currentTurnSI].sign;
                console.log('botSign :: >>', botSign)
                let oppoSign = "";
                if (botSign === "X")
                    oppoSign = "O";
                else
                    oppoSign = "X";





            console.log('player name :: >>', turndata.playerInfo[turndata.currentTurnSI].playerName)
            let moveData = {
                eventName: 'MOVE',
                data: {
            
                    name: turndata.playerInfo[turndata.currentTurnSI].playerName,
           
                    tableId: turndata._id
                }
            }
            //movePieces(moveData, { id: "bot", userId: turndata.playerInfo[turndata.currentTurnSI]._id, tableId: turndata._id })
        }
    }
    } catch (error) {
        console.log('botTurn ERROR :: >>', error);

    }
}
