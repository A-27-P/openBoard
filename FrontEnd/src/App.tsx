import {Routes, Route} from "react-router-dom"
import Canvas from "./Canvas/Canvas"

const App = () => {
  return (
    <div>
      
      
      <Routes>
        <Route path="/canvas" element = { <Canvas/> } />



      </Routes>





    </div>
  )
}

export default App