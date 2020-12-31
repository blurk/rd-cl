import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from "express";
import morgan from 'morgan';
import "reflect-metadata";
import { createConnection } from "typeorm";
import trim from './middlewares/trim';
import authRoutes from './routes/auth';
import postsRoutes from './routes/posts';
import subsRoutes from './routes/subs';

dotenv.config()

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(morgan('dev'))
app.use(trim)
app.use(cookieParser())

app.get('/', (_, res) => {
    res.send("Hello Wolrd!")
})

app.use('/api/auth', authRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/subs', subsRoutes)

app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);

    try {
        await createConnection();
        console.log('Database Connected');

    } catch (error) {
        console.log(error)
    }

})