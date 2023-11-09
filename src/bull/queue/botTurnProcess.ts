// import { redis } from "../../connection/redisConnection";
import QUEUE from "bull";
import bullKeys from "../../constants/bullKey";
import { botTurn } from "../../bot/botTurn";



const botTurnProcess = async (data: any) => {
    try{
    console.log('bot turn process called',data)
    let roundQueue = new QUEUE(bullKeys.TURN_DELAY_QUEUE)

    let options = {
        delay: data.time,
        jobId: data.jobId,
        removeOnComplete:true
    }

    await roundQueue.add(data, options)


    roundQueue.process(async (job:any)=>{
        // console.log('process time ',new Date())
        console.log('Bot turn function run now 0000000');
        
       botTurn(job.data.tableData)

    })
}  catch (error) {
    console.log('botTurnProcess ERROR', error)
}
}
export default botTurnProcess;

