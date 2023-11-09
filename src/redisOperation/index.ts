import { Redis } from "ioredis";
import { redis } from "../connection/redisConnection";

const Get = async (key: string) => {
    try {
        console.log('key=================', key)
        let data: any = await redis.get(key);
        console.log('redis getData', data)
        data = (data) ? JSON.parse(data) : null;
        if (data) {
            return data
          }
          else {
            return false
          }
    } catch (error) {
        console.error(`Error in Get function: ${error}`);
        return null; 
    }
};

// const Set = async (key: string, data: any) => {

//     try {
//         return await redis.set(key, JSON.stringify(data));
//     } catch (error) {
//         console.error(`Error in Set function: ${error}`);
//         return false; 
//     }
// };

const Set = async (key: string, data: any) => {
    try {
      console.log('set data ================>>', data)
      return await redis.set(key, JSON.stringify(data))
    } catch (error) {
      console.log('redis operation set ERROR', error);
  
    }
  }

const Del = async (key: string) => {
    try {
        return await redis.del(key);
    } catch (error) {
        console.error(`Error in Del function: ${error}`);
        return false; 
    }
};

export { Get, Set, Del };
