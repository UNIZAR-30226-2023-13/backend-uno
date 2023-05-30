import { Request, Response, NextFunction } from "express";

function auth(req: Request, res: Response, next: NextFunction) {
    // Si es una sesion que ya habia iniciado sesion
    if (req.session.loggeado === true) {
        next();
    } else {
        res.status(401);
        res.send("No tienes permisos");
    }
}

module.exports = auth;
