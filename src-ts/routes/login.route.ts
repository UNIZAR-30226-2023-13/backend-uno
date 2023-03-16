import express, {Request, Response, Router } from 'express';
const router: Router = express.Router()

router.post('./login', (req: Request, res: Response) => {
    const username: string = req.body.username
    const password: string = req.body.password
    console.log("username: " + username + "\t contraseña:" + password)

    if(username==="frontend" && password==="frontend"){
        req.session.loggeado=true
        req.session.username=username
        res.status(200)
    }
    else{
        res.status(403)
    }
});

module.exports = router;
