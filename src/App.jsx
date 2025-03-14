import { useEffect, useState } from "react";
import './App.css';
import { Routes, Route, HashRouter } from "react-router-dom";
// import Splash from "./components/common/Splash/Splash"; // Import your Splash component
import UserRegister from "./components/UserRegister/UserRegister";
import UserLogin from "./components/UserLogin/UserLogin";
import IndexPage from "./components/IndexPage/IndexPage";
import WelcomPage from "./components/WelcomPage/WelcomPage";
import PaperDetailPage from "./components/PaperDetailPage/PaperDetailPage";
import Lectures from "./components/Lectures/Lectures";
import MyProfile from "./components/MyProfile/MyProfile";
import QuizAnalysis from "./components/QuizAnalysis/QuizAnalysis";
import MyMockDetails from "./components/MyMockDetails/MyMockDetails";
import MyCourses from "./components/MyCourses/MyCourses";
import Help from "./components/HelpPage/Help";
import PremiumAccess from "./components/PremiumAccess/PremiumAccess";
import PlanDetailPage from "./components/PlanDetailPage/PlanDetailPage";
import AnswerKey from "./components/Answerkey/AnswerKey";
import Cart from "./components/Cart/Cart";
import SeparateCart from "./components/Cart/SeparateCart/SeparateCart";
import Instructions from "./components/Instructions/Instructions";
import FavoriteModuleDetail from "./components/ModuleSummery/FavoriteModuleDetail";
import SeeAllContent from "./components/IndexPage/SeeAllContent/SeeAllContent";
import MyFavorites from "./components/MyFavorites/MyFavorites";
import TermsConditions from "./components/TermsConditions/TermsConditions";
import NotificationPage from "./components/NotificationPage/NotificationPage";
import SlideView from "./components/PaperDetailPage/SlideView";
import PptViewer from "./components/ModuleSummery/PPTViewer/PPTViewer";

function App() {
  // const [showSplash, setShowSplash] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);

  // useEffect(() => {
  //   // Hide splash screen after 2 seconds
  //   const timer = setTimeout(() => {
  //     setShowSplash(false);
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    // Screenshot detection for Windows (PrintScreen key)
    const handleKeyUp = (e) => {
      if (e.key === "PrintScreen") {
        setShowOverlay(true);
        setTimeout(() => {
          setShowOverlay(false);
        }, 1000);
      }
    };

    // Detect when user switches apps (for iOS & Android)
    const handleVisibilityChange = () => {
      setIsBlurred(document.hidden);
    };

    window.addEventListener("keyup", handleKeyUp);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // if (showSplash) {
  //   return <Splash />; // Show splash screen first
  // }

  return (
    <HashRouter>
      {/* Screenshot Prevention Overlay */}
      {showOverlay && <div className="black-overlay"></div>}

      {/* Apply Blur Effect When App Goes to Background */}
      <div className={isBlurred ? "blur-content" : ""}>

        {/* Watermark to discourage screenshots */}
        {(showOverlay || isBlurred) && <div className="watermark">Confidential - {new Date().toLocaleString()}</div>}

        <Routes>
          <Route path="/" Component={IndexPage} />
          <Route path="/signup" Component={UserRegister} />
          <Route path="/notification" Component={NotificationPage} />
          <Route path="/login" Component={UserLogin} />
          <Route path="/welcome" Component={WelcomPage} />
          <Route path="/paper-details/:paperTitle/:paperId" Component={PaperDetailPage} />
          <Route path="/lectures/:paperTitle/:paperId/:videoId/:isAccessible" Component={Lectures} />
          <Route path="/my-profile" Component={MyProfile} />
          <Route path="/quiz-analysis" Component={QuizAnalysis} />
          <Route path="/my-mock-details" Component={MyMockDetails} />
          <Route path="/my-course-details" Component={MyCourses} />
          <Route path="/my-favourites" Component={MyFavorites} />
          <Route path="/help" Component={Help} />
          <Route path="/premium-plans" Component={PremiumAccess} />
          <Route path="/plan-detail-page" Component={PlanDetailPage} />
          <Route path="/answer-key" Component={AnswerKey} />
          <Route path="/cart/:planindex/:amount/:paperCount" Component={Cart} />
          <Route path="/cart" Component={SeparateCart} />
          <Route path="/instructions" Component={Instructions} />
          <Route path="/module-summery/:moduleId" Component={FavoriteModuleDetail} />
          <Route path="/pdf/:moduleId" Component={PptViewer} />
          <Route path="/see-all-mobile-indexpage" Component={SeeAllContent} />
          <Route path="/terms-and-conditions" Component={TermsConditions} />
          <Route path="/slide/:videoId" Component={SlideView} />
        </Routes>

      </div>
    </HashRouter>
  );
}

export default App;
