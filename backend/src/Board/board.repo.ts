import Board from "../Models/Board.js"

const create = async(userId : string) => {
    
    try {

        const already = await Board.findOne({owner: userId}) ;
        if(already) {
            return already._id ;
        }

        const response = await Board.create({
            name : `User ${userId}'s Board`, 
            owner: userId, 
            collaborators: [userId]
        }) ;

        return response._id ;


    } catch (err) {
        throw new Error(err as string) ;
    }
}

export default {
    create
}