import { useAuth } from "../AuthContext/authcontext";
import { useNavigate } from "react-router-dom";

export default function PublicCompo ({children}: {children: React.ReactNode}): React.ReactNode {
    const navigate = useNavigate() ;
    const auth = useAuth() ;
    
    
    if(auth?.loading) return <>wait</>
    console.log(auth) ;
    if(auth?.islogin) {
        navigate("/canvas") ;
        return  ;
    }

    return children;

}