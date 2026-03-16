import { useNavigate } from "react-router-dom"
import "./login.css"
import { loginapi } from "../Services/api";
import { useAuth } from "../AuthContext/authcontext";

const login = () => {
    const navigate = useNavigate() ;
    const auth = useAuth() ;
    const handlelogin = async(FormData: any) => {
        const email = FormData.get("email") ;
        const password = FormData.get("password") ;
        try {
            const userId = await loginapi(email, password) ;

            auth?.login(userId) ;
        } catch(err) {
            console.log(`Error while loging in, ${err}`) ;
            
        }
    }

  return (
    <div className='login-main'>
        <form action={handlelogin} className="login-form">
            
            <div className="login-email">
                <div className="login-email-left">
                    Enter Email: 
                </div>
                <div className="login-email-right">
                    <input type="email" name="email" id="" />
                </div>
            </div>
            <div className="login-password">
                <div className="login-pass-left">
                    Enter Password:
                </div>
                <div className="login-pass-right">
                    <input type="password" name="password" id="" />
                </div>


            </div>
        <div className="login-submit">
            <button type="submit">
                login
            </button>
            <button type = "button" onClick={() => navigate("/signup")}>
                Create New Account
            </button>
        </div>


        </form>


    
    
    
    
    
    </div>
  )
}

export default login