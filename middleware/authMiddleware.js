import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';

const checkAuth = async(req, res, next) =>{
    let token;
    // console.log("desde mi Middlewere");
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            // lo separamos por que el token al principio tiene la palabra beater
            token = req.headers.authorization.split(' ')[1];
             const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decoded);
            // el .select sirve para poner lo que no queremos dentreo del arreglo
             req.veterinario = await Veterinario.findById(decoded.id).select("-password");

            // console.log(req);
           return next();

            
        } catch (erro) {
            const e = new Error("token no valido");
            res.status(403).json({msg: e.message});
        }
    }

    if(!token){
        const error = new Error("token no valido o inexistente");
        res.status(403).json({msg: error.message});
    }
    next();
}


export default checkAuth;