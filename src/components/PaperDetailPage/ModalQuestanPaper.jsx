import { useEffect, useState } from "react";
import { LuHeart } from "react-icons/lu";
import { Link } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../baseUrl";
import { DownloadIcon, EyeIcon } from "lucide-react";

const ModalQuestanPaper = ({ paperId }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(
          `${baseUrl}/api/fetch-model-questian-paper/${paperId}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (paperId) {
      fetchQuestions();
    }
  }, [paperId]);
  return (
    <div>
      <div className="module-card questianPaper-card">
        <div className="module-card-left">
          <h4 className="module-title">
            {loading ? "Loading..." : questions.length > 0 ? questions[0].paperTitle : "No Paper Found"}
          </h4>
          <div className="button-heart">
            <a target="_blank" href={questions[0]?.fileUrl}>
              <button>View Question Paper <EyeIcon className="eye-icon"/></button>
            </a>
            <LuHeart className="hear-icon" />
          </div>
        </div>
        <div className="module-card-right">
          <img src="/Images/Module-icon.png" alt="Module Icon" />
          <DownloadIcon className="download-icon"/>
        </div>
      </div>
    </div>
  );
};

export default ModalQuestanPaper;
