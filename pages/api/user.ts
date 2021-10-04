import type {NextApiRequest, NextApiResponse} from 'next';
import {DefaultResponseMsg} from '../../types/DefaultResponseMsg';
import { User} from '../../types/User';
import connectDB from '../../middlewares/ConnectDB';
import {UserModel} from '../../models/UserModel';

 const handler = async(req: NextApiRequest, res : NextApiResponse<DefaultResponseMsg>) =>{
    try{
        if(req.method !== 'POST'){
            res.status(400).json({ error: 'Metodo solicitado não existe '});
            return;
        }

        if(req.body){
            const user = req.body as User;
            if(!user.name || user.name.length < 3){
                res.status(400).json({ error: 'Nome do usuario invalido '});
            return;
            }

            if(!user.email || user.email.includes('@') || user.email.includes('.com')
                || user.email.length < 4){
                    res.status(400).json({ error: 'Email do usuario invalido '});
            return;
            } 

            if(!user.password || user.password.length < 4){
                res.status(400).json({ error: 'Senha do usuario invalida '});
            return;
            }
            await UserModel.create(user);
            res.status(200).json({msg: 'Usuario adicionado com sucesso'});
            return;
        }       

        res.status(400).json({error: 'Parametros de entrada invalido'}); 
    }catch(e){
        console.log('Erro ao criar usuario: ', e);
        res.status(500).json({ error: 'Erro ao criar usuario, tente novamente '});
    }
}

export default connectDB(handler);
