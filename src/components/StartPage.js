import { Fragment, useEffect, useState } from "react";
import useHttp from "../hooks/useHttp";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const StartPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState({
    category: null,
    numberOfQuestions: null,
  });

  const { error, isLoading, sendRequest } = useHttp();

  const getCategories = (data) => {
    setCategories(data.trivia_categories);
  };

  useEffect(() => {
    sendRequest(
      {
        url: "https://opentdb.com/api_category.php",
      },
      getCategories
    );
  }, [sendRequest]);

  const showQuiz = () => {
    navigate("/quiz", {
      state: {
        category: selected.category || categories[0].id,
        number: selected.numberOfQuestions || 5,
      },
    });
  };

  return (
    <div className="startPage">
      {!isLoading ? (
        <Fragment>
          <h1>Quizzical</h1>
          <p>
            You will be given ten questions on completely different topics.
            Let's see how well you can do.
          </p>
          <div className="startPage__tools">
            {(!error || categories.length > 0) && (
              <>
                <label htmlFor="select">
                  Choose category
                  <select
                    id="select"
                    onChange={(e) =>
                      setSelected((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  >
                    {categories.map((el) => (
                      <option key={el.id} value={el.id}>
                        {el.name}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}

            <label htmlFor="number-select">
              Number of questions
              <select
                id="number-select"
                onChange={(e) =>
                  setSelected((prev) => ({
                    ...prev,
                    numberOfQuestions: e.target.value,
                  }))
                }
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </label>
          </div>
          <button className="button start-button" onClick={showQuiz}>
            Start quiz
          </button>
        </Fragment>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default StartPage;
