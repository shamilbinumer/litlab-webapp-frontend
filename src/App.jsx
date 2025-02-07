import { BrowserRouter, Routes, Route } from "react-router-dom"
import UserRegister from "./components/UserRegister/UserRegister"
import UserLogin from "./components/UserLogin/UserLogin"
import IndexPage from "./components/IndexPage/IndexPage"
import WelcomPage from "./components/WelcomPage/WelcomPage"
import PaperDetailPage from "./components/PaperDetailPage/PaperDetailPage"
import Lectures from "./components/Lectures/Lectures"
import MyProfile from "./components/MyProfile/MyProfile"
import QuizAnalysis from "./components/QuizAnalysis/QuizAnalysis"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={IndexPage} />
          <Route path="/signup" Component={UserRegister} />
          <Route path="/login" Component={UserLogin} />
          <Route path="/welcome" Component={WelcomPage} />
          <Route path="/paper-details/:paperId" Component={PaperDetailPage} />
          <Route path="/lectures" Component={Lectures} />
          <Route path="/my-profile" Component={MyProfile} />
          <Route path="/quiz-analysis" Component={QuizAnalysis} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
