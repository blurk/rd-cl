import express from "express";
import morgan from 'morgan';
import "reflect-metadata";
import { createConnection } from "typeorm";
import trim from './middlewares/trim';
import authRoutes from './routes/auth';



const app = express();

app.use(express.json());
app.use(morgan('dev'))
app.use(trim)

app.get('/', (_, res) => {
    res.send("Hello Wolrd!")
})

app.use('/api/auth', authRoutes)

app.listen(5000, async () => {
    console.log(`Server running at http://localhost:5000`);

    try {
        await createConnection();
        console.log('Database Connected');

    } catch (error) {
        console.log(error)
    }

})