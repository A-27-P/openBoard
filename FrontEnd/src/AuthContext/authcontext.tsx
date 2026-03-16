import { createContext, useContext, useEffect, useState } from "react"
import { myapi } from "../Services/api";

export interface AuthType {
    islogin: boolean,
    login: Function,
    logout: Function,
    loading: any,
    _id: String | null 
}

const AuthContext = createContext<AuthType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {


    const [islogin, setislogin] = useState(false);
    const [loading, setloading] = useState<boolean>(true);
    const [_id, setid] = useState<String | null>(null) ;


    useEffect(() => {
        const run = async () => {
            try {
                setloading(true);
                const response = await myapi.get("/auth/checkme");
                // console.log(response.data.user.role) ;
                console.log(response.data) ;
                setid(response.data.user._id) ;
                setislogin(true);

            }
            catch (err) {
                setid("") ;
                setislogin(false);
                setloading(false);
            }
            finally {
                setloading(false);
            }
        }
        run() ;       
    }, [])




    function login(id:string) {
        setid(id) ;
        setislogin(true);
    }
    function logout() {
        setislogin(false);

        setloading(false);
    }





    return (
        <AuthContext.Provider value={{ islogin, login, logout, loading, _id }} >
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(! context) throw new Error("no auth context is there") ;

    return context ;

}