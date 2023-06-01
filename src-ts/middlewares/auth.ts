import { Request, Response, NextFunction } from "express";

function auth(req: Request, res: Response, next: NextFunction) {
    // Si es una sesion que ya habia iniciado sesion
    if (req.session.loggeado === true) {
        // Para actualizar la cookie cada minuto
        req.session.nowInMinutes = Math.floor(Date.now() / 60e3);
        next();
    } else {
        res.status(401);
        res.send("No tienes permisos");
    }
}

module.exports = auth;
