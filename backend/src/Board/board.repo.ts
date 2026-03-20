import { after } from "node:test";
import Board from "../Models/Board.js"

const create = async (userId: string) => {

    try {


        const response = await Board.findOneAndUpdate({
            owner: userId
        }, {
            $setOnInsert: {
                name: `User ${userId}'s Board`,
                owner: userId,
                collaborators: [userId]
            }
        }, {
            // new: true,
            returnDocument:"after",

            upsert: true
        }
        ) ;
        console.log(response) ;


        
        return response?._id;


    } catch (err) {
        throw new Error(err as string);
    }
}

const addCollab = async (owner: string, collab_user_id: string) => {
    try {
        
        const response = await Board.findOneAndUpdate({ owner }, {
            $addToSet: {
                collaborators: collab_user_id
            }
        }, {
            // new: true
            returnDocument: "after"
        });
        
        return response;

    } catch (err) {
        throw new Error(err as string);
    }
}

export default {
    create,
    addCollab
}