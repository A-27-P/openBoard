import React, { useEffect } from "react";

import { Navigate} from "react-router-dom";
import { useAuth } from "../AuthContext/authcontext";

export default function PrivateCompo ({children}: {children: React.ReactNode}): React.ReactNode {
    
    const auth = useAuth() ;
 
    if(auth?.loading) return <> Loading </>

    if(! (auth?.islogin)) {
        return < Navigate to = "/login" /> 
    }
       
    return children;




}