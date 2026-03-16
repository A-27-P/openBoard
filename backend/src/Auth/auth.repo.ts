import User from "../Models/User.js"


const createuser = async(data: any) => {
    try {

        const response = await User.create(data) ;

        return response ;
        
    } catch(err) {
        throw new Error(err as string) ;
    }


}

const signin = async(email: string) => {
    try {
        const response = await User.findOne({email}) ;

        return response ;


    } catch(err){
        throw new Error(err as string) ;
    }

}




export default {
    createuser,
    signin
}