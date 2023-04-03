import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from "cookie-session";

dotenv.config();

const loginRoute = require('./routes/login.route')
const amigosRoute = require('./routes/amigos.route')
const aspectosRoute = require('./routes/aspectos.route')
const auth = require('./middlewares/auth')
const cors = require('cors')
const app: Express = express();
const port = process.env.PORT;

declare module 'express-session' {
  interface SessionData {
    username: string;
    loggeado: boolean;
  }
}

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieSession({ 
  maxAge: 1000*60*60*24,
  keys: ["mykey"]
}));

app.use('/login',loginRoute);

app.use('/amigos',auth,amigosRoute);

app.use('/aspectos',auth,aspectosRoute);

app.get('/',auth,(req: Request, res: Response) => {
  res.send('Express + TypeScript Server (is running)');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
