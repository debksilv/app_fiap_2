import type {NextApiRequest, NextApiResponse} from 'next';
import { DefaultResponseMsg } from "../../types/DefaultResponseMsg";
import connectDB from '../../middlewares/connectDB';
import jwtValidator from '../../middlewares/jwtValidator';
import { Task } from '../../types/Task';
import { TaskModel } from '../../models/TaskModel'; 
import { UserModel } from '../../models/UserModel'; 
import { GetTasksQueryParams } from '../../types/GetTasksQueryParams';

const handler = async(req:NextApiRequest, res : NextApiResponse<DefaultResponseMsg | Task[]>) =>{
    try{
        if(req.method ==='POST'){
            return await saveTask(req, res);
        }else if(req.method ==='GET'){
            return await getTask(req, res);
        }else if(req.method ==='PUT'){
            return;
        }else if(req.method ==='DELETE'){
            return;
    }

        res.status(400).json({ error: 'Método solicitado não existe '});
    }catch(e){
        console.log('Ocorreu erro ao gerenciar tarefas: ', e);
        res.status(500).json({ error: 'Ocorreu erro ao gerenciar tarefas, por favor, tente novamente '});
    }
}

const getTask = async(req:NextApiRequest, res : NextApiResponse<DefaultResponseMsg | Task[]>) =>{
    const userId = req?.body?.userId ? req?.body?.userId : req?.query?.userId as string;
    const failedtValidation = await validateUser(userId);
    if(failedtValidation){
        return res.status(400).json({ error: failedtValidation});
    }

    const params = req.query as GetTasksQueryParams;

    const query = {
        userId
    } as any;

    if(params?.finishPrevisionStart){
        const inputDate = new Date(params?.finishPrevisionStart);
        query.finishPrevisionDate = { $gte : inputDate}
    }

    if(params?.finishPrevisionEnd){
        const lastDate = new Date(params?.finishPrevisionEnd);
        if(!query.finishPrevisionDate){
            query.finishPrevisionDate = {};
        }
        query.finishPrevisionDate.$lte = lastDate
    }

    if(params?.status){
        const status = parseInt(params?.status);
        switch(status){
            case 1: 
                console.log('switch 1')
                query.finishDate = null;
               break;
            case 2: 
                console.log('switch 2')
                query.finishDate = {$ne : null};
               break;
            default: break;
        }
    }

    console.log('query', query);
    const result = await TaskModel.find(query) as Task[];
    console.log('result', result);
    return res.status(200).json(result)
}


const validateUser = async (userId: string) =>{
    if(!userId){
        return 'Usuário não informado';
    }

    const userFound = await UserModel.findById(userId);
        if(!userFound){
            return 'Usuário não encontrado';
        }
}   

const saveTask = async(req:NextApiRequest, res : NextApiResponse<DefaultResponseMsg>) =>{
    if(req.body){
        const userId = req.body.userId;
        const failedtValidation = await validateUser(userId);
        if(failedtValidation){
            return res.status(400).json({ error: failedtValidation});
        }

        const task = req.body as Task;

        if(!task.name || task.name.length <2){
            return res.status(400).json({ error: 'Nome da tarefa inválida '});
        }

        console.log(task.finishPrevisionDate)
        console.log(typeof task.finishPrevisionDate)
        if(!task.finishPrevisionDate || new Date(task.finishPrevisionDate).getDate() < new Date().getDate()){
            return res.status(400).json({ error: 'Data de previsão inválida ou menor que hoje'});
        }

        const final = {
            ...task,
            userId,
            finishDate : undefined
        } as Task;
    
        await TaskModel.create(final);
        return res.status(200).json({ error: 'Tarefa criada com sucesso'});
    }

    return res.status(400).json({ error: 'Parâmetros de entrada inválidos '});
}

    export default connectDB(jwtValidator(handler));