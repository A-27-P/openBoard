import axios from "axios" 


export const myapi = axios.create({
  baseURL: "http://localhost:8000/",
  withCredentials: true
})



export const signupapi = async (name: string, email: string, password: string) => {
  try {

    const response = await myapi.post("/auth/signup", {
      name, email, password
    }) ;

    return response.data.data._id ;



  } catch(err) {
     throw new Error(err as string) ;
  }
}

export const loginapi = async(email: string, password: string) => {
  try {
    const response = await myapi.post("/auth/signin", {
      email, password
    }) ;

    return response.data.data._id ;


  } catch(err) {
    throw new Error (err as string) ;
  }
}


export const createNewBoard = async() => {
  try {
    const response = await myapi.post("/board") ;


    const boardid = response.data.data ;
    return boardid ;


  } catch(err){

    throw new Error(err as string) ;
  }
}