import express, { Express, Request, RequestHandler, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";

dotenv.config();

import loginRoute = require("./routes/login.route");
import amigosRoute = require("./routes/amigos.route");
import signUpRouter = require("./routes/signup.route");
import cuentaRouter = require("./routes/cuenta.route");
import aspectosRoute = require("./routes/aspectos.route");
import auth = require("./middlewares/auth");
import cors from "cors";
const app: Express = express();
const port = process.env.PORT;

declare module "express-session" {
    interface SessionData {
        username: string;
        loggeado: boolean;
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

app.use("/cuenta", cuentaRouter as RequestHandler);

app.use("/amigos", auth as RequestHandler, amigosRoute as RequestHandler);

app.use("/aspectos", auth as RequestHandler, aspectosRoute as RequestHandler);

app.get("/", auth as RequestHandler, (req: Request, res: Response) => {
    res.send("Express + TypeScript Server (is running)");
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
