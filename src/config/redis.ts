import Redis from 'ioredis';
import dotenv from 'dotenv';
import { createDataSet } from './db';  // db.ts에서 createDataSet 함수를 import

dotenv.config();

export const redis = new Redis({
  host: '127.0.0.1',  // Redis 서버의 IP 주소
  port: Number(process.env.REDIS_PORT),  // Redis 서버의 포트 번호
  password: process.env.REDIS_PW,  // 필요한 경우 Redis 서버의 비밀번호
})

// 데이터셋을 Redis에 저장하고 주기적으로 갱신하는 함수
async function refreshDataSetPeriodically() {
  try {
    const dataSet = await createDataSet();
    await redis.set('myDataSet', JSON.stringify(dataSet));
    // 1시간 후에 만료되도록 설정
    await redis.expire('myDataSet', 3600);
    console.log('Dataset refreshed and saved to Redis.');
  } catch (error) {
    console.error('Error refreshing dataset:', error);
  }
}
refreshDataSetPeriodically();

// 1시간마다 데이터셋 갱신
setInterval(refreshDataSetPeriodically, 3600 * 1000);
