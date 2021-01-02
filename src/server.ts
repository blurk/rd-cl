import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import trim from './middlewares/trim'
import authRoutes from './routes/auth'
import miscRoutes from './routes/misc'
import postRoutes from './routes/posts'
import subRoutes from './routes/subs'

dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(morgan('dev'))
app.use(trim)
app.use(cookieParser())
app.use(
    cors({
        credentials: true,
        origin: process.env.ORIGIN,
        optionsSuccessStatus: 200,
    })
)

app.get('/', (_, res) => res.send('Hello World'))
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/subs', subRoutes)
app.use('/api/misc', miscRoutes)

app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`)

    try {
        await createConnection()
        console.log('Database connected!')
    } catch (err) {
        console.log(err)
    }
})