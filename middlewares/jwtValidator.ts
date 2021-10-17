import type {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';
import { DefaultResponseMsg } from '../types/DefaultResponseMsg';
import jwt, { JwtPayload } from 'jsonwebtoken';

const jwtValidator = (handler : NextApiHandler) =>
    async (req : NextApiRequest, res : NextApiResponse<DefaultResponseMsg>) => {

    const {MY_SECRET_KEY} = process.env;
    if(!MY_SECRET_KEY){
        return res.status(500).json({ error: 'ENV my secret key não encontrada '});   
    }

    if(!req || !req.headers){
        return res.status(400).json({ error: 'Não foi possível validar o token de acesso '});   
    }

    if(req.method !== 'OPTIONS'){
        const authorization = req.headers['authorization'];
        if(!authorization){
            return res.status(401).json({ error: 'Nenhum token de acesso informado '}); 
        }

        const token = authorization.substr(7);
        if(!token){
            return res.status(401).json({ error: 'Nenhum token de acesso informado '}); 
        }

        try{
           const decode = await jwt.verify(token, MY_SECRET_KEY) as JwtPayload;
           if(!decode){
               return res.status(401).json({ error: 'Não foi possível validar o token '}); 
           }

           if(req.body){
               req.body.userId = decode._id;
           }else if(req.query){
               req.query.userId = decode._id;
           }           
        }catch(e){
            console.log (e)
            return res.status(500).json({ error: 'Ocorreu erro ao tratar o token JWT '});
        }
    }

    return handler(req, res);
}

export default jwtValidator;
