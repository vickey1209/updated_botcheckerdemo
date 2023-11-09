import QUEUE from "bull";
import { BULL_KEY} from "../../constants";
import {redis} from '../../connection/redisConnection'
import {userTurnStarted} from '../../playing/userTurnStarted'

const delayTimer = (data: any) => {
    console.log('delayTimer ======================', data)
    let redisData:any={
        port:process.env.REDIS_PORT,
        host:process.env.REDIS_HOST,
        db:process.env.REDIS_DB,
    }
    let roundQueue = new QUEUE(BULL_KEY.ROUND_TIMER_START, {redis:redisData})
    let options = {
        delay:data.time,
        jobId: data.jobId,
        attempts: 1
    }

    roundQueue.add(data, options)
    roundQueue.process(async (jobData: any) => {
        console.log('jobData-============', jobData.data)
        userTurnStarted(jobData.data.tableId)
    })
}

export { delayTimer }
