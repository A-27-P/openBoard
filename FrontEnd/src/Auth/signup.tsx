import { useNavigate } from "react-router-dom"
import {signupapi} from "../Services/api"
import "./signup.css"
import { useAuth } from "../AuthContext/authcontext"

const signup = () => {
    const auth = useAuth()
    const navigate = useNavigate() ;
    const handlesignup = async (FormData: any) => {
        const name = FormData.get("name") ;
        const email = FormData.get("email") ;
        const password = FormData.get("password") ;
        
        try {
            const userID = await signupapi(name, email, password) ;

            auth?.login(userID) ;




        }catch(err) {
            alert("Something went wrong") ;
        }

    }


  return (
    <div className='signupmain'>
        <form action={handlesignup} className="signup-form">
            <div className="signup-name">
                <div className="signup-name-left">
                    Enter Name : 
                </div>
                <div className="signup-name-right">
                    <input type="text" name = "name"/>
                </div>
            </div>
            <div className="signup-email">
                <div className="signup-email-left">
                    Enter Email: 
                </div>
                <div className="signup-email-right">
                    <input type="email" name="email" id="" />
                </div>
            </div>
            <div className="signup-password">
                <div className="signup-pass-left">
                    Enter Password:
                </div>
                <div className="signup-pass-right">
                    <input type="password" name="password" id="" />
                </div>


            </div>
        <div className="signup-submit">
            <button type="submit">
                Signup
            </button>
            <button type="button"
            onClick={() => navigate("/login")}
            >
                Go to Login
            </button>
        </div>


        </form>



    </div>
  )
}

export default signup