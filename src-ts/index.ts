import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from "cookie-session";
const loginRoute = require('./routes/login.route')
const amigosRoute = require('./routes/amigos.route')
const auth = require('./middlewares/auth')

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

declare module 'express-session' {
  interface SessionData {
    username: string;
    loggeado: boolean;
  }
}

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieSession({ keys: ["mykey"] }));


declare module 'express-session' {
  interface SessionData {
    username: string;
    loggeado: boolean;
  }
}

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieSession({ keys: ["mykey"] }));

app.use('/login',loginRoute);

app.use('/amigos',auth,amigosRoute);

app.get('/',auth,(req: Request, res: Response) => {
  res.send('Express + TypeScript Server (is running)');
});



app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
