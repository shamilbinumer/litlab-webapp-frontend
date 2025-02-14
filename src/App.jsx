import { BrowserRouter, Routes, Route } from "react-router-dom"
import UserRegister from "./components/UserRegister/UserRegister"
import UserLogin from "./components/UserLogin/UserLogin"
import IndexPage from "./components/IndexPage/IndexPage"
import WelcomPage from "./components/WelcomPage/WelcomPage"
import PaperDetailPage from "./components/PaperDetailPage/PaperDetailPage"
import Lectures from "./components/Lectures/Lectures"
import MyProfile from "./components/MyProfile/MyProfile"
import QuizAnalysis from "./components/QuizAnalysis/QuizAnalysis"
import MyMockDetails from "./components/MyMockDetails/MyMockDetails"
import MyCourses from "./components/MyCourses/MyCourses"
import Help from "./components/HelpPage/Help"
import PremiumAccess from "./components/PremiumAccess/PremiumAccess"
import PlanDetailPage from "./components/PlanDetailPage/PlanDetailPage"
import AnswerKey from "./components/Answerkey/AnswerKey"
import Cart from "./components/Cart/Cart"
import Instructions from "./components/Instructions/Instructions"
import YourFavorite from "./components/YourFavorites/YourFavorite"
import FavoriteModuleDetail from "./components/ModuleSummery/FavoriteModuleDetail"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={IndexPage} />
          <Route path="/signup" Component={UserRegister} />
          <Route path="/login" Component={UserLogin} />
          <Route path="/welcome" Component={WelcomPage} />
          <Route path="/paper-details/:paperTitle/:paperId" Component={PaperDetailPage} />
          <Route path="/lectures/:paperTitle/:paperId/:videoId" Component={Lectures} />
          <Route path="/my-profile" Component={MyProfile} />
          <Route path="/quiz-analysis" Component={QuizAnalysis} />
          <Route path="/my-mock-details" Component={MyMockDetails} />
          <Route path="/my-course-details" Component={MyCourses} />
          <Route path="/help" Component={Help} />
          <Route path="/premium-plans" Component={PremiumAccess} />
          <Route path="/plan-detail-page" Component={PlanDetailPage} />
          <Route path="/answer-key" Component={AnswerKey} />
          <Route path="/cart-page" Component={Cart} />
          <Route path="/instructions" Component={Instructions} />
          <Route path="/Your-Favorites" Component={YourFavorite} />
          <Route path="/module-summery/:moduleId" Component={FavoriteModuleDetail} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
