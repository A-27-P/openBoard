import {Routes, Route, Navigate} from "react-router-dom"
import Canvas from "./Canvas/Canvas"
import Signup from "./Auth/signup"
import Login from "./Auth/login"
import "./App.css"
import PublicCompo from "./ProtectedRoutes/Public"
import PrivateCompo from "./ProtectedRoutes/Private"
const App = () => {
  return (
    <div>
      
      
      <Routes>
        <Route path="/" element = {<Navigate to = "/login" /> }/> 
        <Route path="/login" element = {<PublicCompo > <Login/> </PublicCompo>} />
        <Route path = "/signup" element = {<PublicCompo><Signup/></PublicCompo>} /> 
        <Route path="/canvas" element = {<PrivateCompo> <Canvas/>  </PrivateCompo>} />

      </Routes>





    </div>
  )
}

export default App