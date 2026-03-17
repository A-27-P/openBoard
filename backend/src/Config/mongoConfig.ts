import mongoose from "mongoose";




const connectDb = async () => {

    try {
        const mongoURI = process.env.MONGO_URI ;
        if(!mongoURI) {
            console.log("No DB String provided") ;
            process.exit(-1) ;
        }

        const connection = await mongoose.connect(mongoURI) ;


        console.log("\n----- MONGO DB connected: ", connection.connection.host, "------\n") ;

    } catch (err) {
        console.log("Error while connecting to the database", err) ;
        process.exit(-1) ;
    }
}

export default connectDb ;