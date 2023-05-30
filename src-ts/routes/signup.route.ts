import express, { Request, Response, Router } from "express";
import { crearCuenta } from "../services/signup.service";
const signUpRouter: Router = express.Router();

signUpRouter.post("/", async (req: Request, res: Response) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    const email: string = req.body.email;

    // Intentamos crear el usuario
    const creada: boolean = await crearCuenta(username, email, password);
    if (creada) {
        req.session.loggeado = true;
        req.session.username = username;
        res.status(200);
        res.send("Ok, cuenta creada");
    }
    // Si ya existe un usuario con ese username
    else {
        res.status(403);
        res.send("Ya existe un usuario con ese username");
    }
});

module.exports = signUpRouter;
