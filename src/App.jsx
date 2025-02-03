import { BrowserRouter, Routes, Route } from "react-router-dom"
import UserRegister from "./components/UserRegister/UserRegister"
import UserLogin from "./components/UserLogin/UserLogin"
import IndexPage from "./components/IndexPage/IndexPage"
import WelcomPage from "./components/WelcomPage/WelcomPage"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={IndexPage} />
          <Route path="/signup" Component={UserRegister} />
          <Route path="/login" Component={UserLogin} />
          <Route path="/welcome" Component={WelcomPage} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
