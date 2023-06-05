import express, { Express, Request, RequestHandler, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import { Socket, Server as SocketIOServer } from "socket.io";
import http = require("http");
import { Tablero } from "./models/tablero";
import { Jugador } from "./models/jugador";

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
        origin: "http://localhost:3000",
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
        origin: "http://localhost:3000",
    })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cookieSession({
        maxAge: 1000 * 60 * 60 * 24,
        keys: ["mykey"],
    })
);

app.use("/login", loginRoute as RequestHandler);

app.use("/signup", signUpRouter as RequestHandler);

app.use("/cuenta", auth as RequestHandler, cuentaRouter as RequestHandler);

app.use("/amigos", auth as RequestHandler, amigosRoute as RequestHandler);

app.use("/aspectos", auth as RequestHandler, aspectosRoute as RequestHandler);

app.use("/partidas", auth as RequestHandler, partidasRouter as RequestHandler);

app.get("/", auth as RequestHandler, (req: Request, res: Response) => {
    res.send("Express + TypeScript Server (is running)");
    // Esto es para rolear que existen partidas
    // Para añadir una cambiar el nombre de jugadores y acceder desde el navegador
    // a la ruta / del server
    const jugador1: Jugador = {
        username: "juan",
        puntos: 0,
        mano: [{ numero: 1, color: "rojo" }],
    };
    const jugador2: Jugador = {
        username: "adrian",
        puntos: 0,
        mano: [],
    };
    const jugador3: Jugador = {
        username: "claudia",
        puntos: 0,
        mano: [{ numero: 1, color: "rojo" }],
    };
    const jugador4: Jugador = {
        username: "javier",
        puntos: 0,
        mano: [],
    };
    const partida: Tablero = new Tablero(
        [],
        [],
        [jugador1, jugador2, jugador3, jugador4],
        true
    );
    partida.ganador = jugador1;
    anadirPartida(partida);
});

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

import { mensajeHandler } from "./handlers/message.socket";
import { connectionHandler } from "./handlers/connectionHandler";
import { desconnectionHandler } from "./handlers/desconnectionHandler";
import { partidaHandler } from "./handlers/partidaHandler";
import { anadirPartida } from "./services/historialPartidas.service";

io.on("connection", (socket: Socket) => {
    // Handler de la conexion
    connectionHandler(socket);

    // Handler de la desconexion
    desconnectionHandler(io, socket);

    // Handler para una partida
    partidaHandler(io, socket);

    mensajeHandler(io, socket);
});
