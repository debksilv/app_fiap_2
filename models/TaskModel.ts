import mongoose, {Schema} from 'mongoose';

const TaskSchema = new Schema({
    name : {type: String, required: [true, '*Campo Obrigatório!']},
    userId : {type: String, required: [true, '*Campo Obrigatório!']},
    finishPrevisionDate : {type: Date, required: [true, '*Campo Obrigatório!']},
    finishDate : {type: Date},
});

export const TaskModel = mongoose.models.tasks || mongoose.model('tasks', TaskSchema);
