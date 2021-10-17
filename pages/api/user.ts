import type {NextApiRequest, NextApiResponse} from 'next';
import md5 from 'md5';
import {DefaultResponseMsg} from '../../types/DefaultResponseMsg';
import { User } from '../../types/User';
import connectDB from '../../middlewares/connectDB';
import {UserModel} from '../../models/UserModel';

 const handler = async(req: NextApiRequest, res : NextApiResponse<DefaultResponseMsg>) => {
    try{
        if(req.method !== 'POST'){
            res.status(400).json({ error: 'Método solicitado não existe '});
            return;
        }

        if(req.body){
            const user = req.body as User;
            if(!user.name || user.name.length < 3){
                res.status(400).json({ error: 'Nome do usuario inválido '});
            return;
            }

            if(!user.email || !user.email.includes('@') || !user.email.includes('.com')
                || user.email.length < 4){
                    res.status(400).json({ error: 'Email do usuário inválido '});
            return;
            } 

            var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
            if(!mediumRegex.test(user.password)){
            res.status(400).json({ error: 'Senha do usuário inválida '});
            return;
            }

            const existingUser = await UserModel.find({ email : user.email });
            if(existingUser && existingUser.length > 0) {
            res.status(400).json({ error: 'Usuário já existe'})
            return;
            }

            const final = {
                ...user,
                password: md5(user.password)
              }

            await UserModel.create(user);
            res.status(200).json({msg: 'Usuário criado com sucesso'});
            return;
        }       

        res.status(400).json({error: 'Parâmetros de entrada inválido'}); 
    }catch(e){
        console.log('Erro ao criar usuário: ', e);
        res.status(500).json({ error: 'Erro ao criar usuário, tente novamente '});
    }
}

export default connectDB(handler);