import mongoose, { mongo } from "mongoose";




const strokeSchema = new mongoose.Schema({
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true,
        index: true 
    }, 
    strokeWidth : {
        type: Number,
        required: true
    },
    strokeColor: {
        type: String, 
        required: true
        
    }, 
    madeBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, 
    points: [
        {
            x : {
                type: Number, required: true
            }, 
            y :{
                type: Number , required: true
            }
        }
    ],
    order : {
        type: Number, 
        required: true
    }
}, {
    timestamps : true
}) ;

strokeSchema.index({ boardId: 1, order: 1 });


export default mongoose.model("Stroke", strokeSchema) ;