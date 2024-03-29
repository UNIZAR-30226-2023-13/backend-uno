import express, { Express, Request, RequestHandler, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectionHandler } from "./handlers/connectionHandler";
import { desconnectionHandler } from "./handlers/desconnectionHandler";
import { partidaHandler } from "./handlers/partidaHandler";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import { Socket, Server as SocketIOServer } from "socket.io";
import http = require("http");

import partidasRouter = require("./routes/partidas.route");
import loginRoute = require("./routes/login.route");
import amigosRoute = require("./routes/amigos.route");
import signUpRouter = require("./routes/signup.route");
import cuentaRouter = require("./routes/cuenta.route");
import aspectosRoute = require("./routes/aspectos.route");
import auth = require("./middlewares/auth");
import cors from "cors";

const app: Express = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.FRONTEND_HOST,
    },
});

const port = process.env.PORT;

declare module "express-session" {
    interface SessionData {
        username: string;
        loggeado: boolean;
        nowInMinutes: number;
    }
}

app.use(
    cors({
        credentials: true,
        origin: process.env.FRONTEND_HOST,
    })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
if (process.env.ENVIROMENT === "DEV") {
    app.use(
        cookieSession({
            maxAge: 1000 * 60 * 60 * 24,
            keys: ["mykey"],
        })
    );
} else {
    app.use(
        cookieSession({
            maxAge: 1000 * 60 * 60 * 24,
            keys: ["mykey"],
            httpOnly: false,
            secureProxy: true,
            sameSite: "none",
        })
    );
}

app.use("/login", loginRoute as RequestHandler);

app.use("/signup", signUpRouter as RequestHandler);

app.use("/cuenta", auth as RequestHandler, cuentaRouter as RequestHandler);

app.use("/amigos", auth as RequestHandler, amigosRoute as RequestHandler);

app.use("/aspectos", auth as RequestHandler, aspectosRoute as RequestHandler);

app.use("/partidas", auth as RequestHandler, partidasRouter as RequestHandler);

app.get("/", auth as RequestHandler, (req: Request, res: Response) => {
    res.send("Express + TypeScript Server (is running)");
});

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

io.on("connection", (socket: Socket) => {
    // Handler de la conexion
    connectionHandler(socket);

    // Handler de la desconexion
    desconnectionHandler(io, socket);

    // Handler para una partida
    partidaHandler(io, socket);
});
