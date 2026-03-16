import { createContext, useContext, useEffect, useState } from "react"
import { myapi } from "../Services/api";

interface AuthType {
    islogin: boolean,
    login: Function,
    logout: Function,
    loading: any,
    _id: String
}

const AuthContext = createContext<AuthType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {


    const [islogin, setislogin] = useState(false);
    const [loading, setloading] = useState<boolean>(true);

    let _id = "";

    useEffect(() => {
        const run = async () => {
            try {
                setloading(true);
                const response = await myapi.get("/auth/checkme");
                // console.log(response.data.user.role) ;
                _id = response.data.user._id;
                setislogin(true);

            }
            catch (err) {
                _id = "";
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
        _id = id ;
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


    return context;

}