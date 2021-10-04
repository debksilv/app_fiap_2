import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import mongoose from 'mongoose';

const connectDB = (handler : NextApiHandler) =>
    async (req : NextApiRequest, res : NextApiResponse) => {


        console.log('MongoDD readyState', mongoose.connections[0].readyState);
        if(mongoose.connections[0].readyState){
            return handler(req, res);
        }    

        const {DB_CONNECTION_STRING} = process.env;
        if(!DB_CONNECTION_STRING){
            return res.status(500).json({error: 'ENV database nao informada'});
        }

        await mongoose.connect('mongoosedb://localhost:27017/gerenciadorTarefasFiapDB');
        mongoose.connection.on('connected', () => console.log('Conectado na database'));
        mongoose.connection.on('error', err => console.log('Ocorreu erro ao conectar na database', err));
        

        return handler(req, res);
    }

    export default connectDB;
