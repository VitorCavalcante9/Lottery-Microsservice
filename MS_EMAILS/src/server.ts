import express from 'express';
import cors from 'cors';
import Consumer from './kafkaService/Consumer';

const consumer = new Consumer('my-first-group');
consumer.consume({ topic: 'new-bets', fromBeginning: false });

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3334, () => console.log('MS_EMAIL running'));
