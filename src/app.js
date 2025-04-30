import express from 'express';
import cors from 'cors'
import mainRouter from './routes/index.js'






export const app = express();


app.use(cors());
app.use(express.json());


app.use('/api', mainRouter )






