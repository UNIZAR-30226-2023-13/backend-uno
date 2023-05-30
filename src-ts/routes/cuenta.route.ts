import express, { Request, Response, Router } from "express";
import { cambiarEmailPassword } from "../services/cuenta.service";

const cuentaRouter: Router = express.Router();

cuentaRouter.post(
    "/cambiar-email-password",
    async (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;
        if (req.session.username && email && password) {
            const username = req.session.username;
            const cambiado = await cambiarEmailPassword(
                username,
                email,
                password
            );
            if (cambiado) {
                res.status(200);
                res.send("Email y contraseña cambiados correctamente");
            } else {
                res.status(403);
                res.send("No se ha podido modificar el email y la contraseña");
            }
        } else {
            res.status(401);
            res.send();
        }
    }
);

module.exports = cuentaRouter;
