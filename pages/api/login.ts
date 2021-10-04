import type {NextApiRequest, NextApiResponse} from "next"
import { Login } from "../../types/Login";
import { DefaultResponseMsg } from "../../types/DefaultResponseMsg";

export default function handler (req : NextApiRequest, res : NextApiResponse) {
    try{
        if(req.method !== 'POST'){
            res.status(400).json({ error: 'Metodo solicitado nao existe '});
            return;
        }

        const body = req.body as Login;
        if(body.login && body.password
           && body.login === 'admin@admin.com'
           && body.password === 'Admin@123'){
           res.status(200).json({msg : 'Login efetuado com sucesso'})
           return;
        }

        res.status(400).json({ error: 'Usuario ou senha inválido '});
    }catch(e){
        console.log('Erro ao autenticar usuario: ', e);
        res.status(500).json({ error: 'Erro ao autenticar usuario, tente novamente '});
    }
}   