import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Question from "./Question";
import Loader from "./Loader";
import Button from "./UI/Button";
import useHttp from "../hooks/useHttp";

const QuizPage = () => {
  const configuration = useLocation();
  const navigate = useNavigate();
  const [newQuiz, setNewQuiz] = useState(false);
  const [quiz, setQuiz] = useState([]);
  const [chosenOption, setChosenOption] = useState([]);
  const [result, setResult] = useState();
  const [checked, setChecked] = useState(false);

  const { error, isLoading, sendRequest } = useHttp();
  const url = !configuration.state
    ? "https://opentdb.com/api.php?amount=5&encode=url3986"
    : `https://opentdb.com/api.php?amount=${configuration.state.number}&category=${configuration.state.category}&encode=url3986`;

  console.log(configuration);

  const shuffle = useCallback((array) => {
    array.sort(() => Math.random() - 0.5);
  }, []);

  useEffect(() => {
    const getQuestions = (res) => {
      const data = res.results;
      const questionsArray = [];
      const answersArray = [];

      data.map((el) => {
        answersArray.push({
          correct: decodeURIComponent(el.correct_answer),
          chosen: "",
        });
        const options = el.incorrect_answers;
        options.push(el.correct_answer);
        shuffle(options);
        return questionsArray.push({
          correct: el.correct_answer,
          incorrect: options,
          question: decodeURIComponent(el.question),
        });
      });
      setChosenOption(answersArray);
      setQuiz(questionsArray);
    };

    sendRequest(
      {
        url: url,
        method: "GET",
      },
      getQuestions
    );
  }, [newQuiz, sendRequest, shuffle, url]);

  const handleOnHold = useCallback((chosen, questionIndex) => {
    setChosenOption((prevOption) => {
      return prevOption.map((item, index) =>
        index === questionIndex ? { ...item, chosen: chosen } : item
      );
    });
  }, []);

  const getQuiz = quiz.map((el, index) => (
    <Question
      key={el.question}
      correctAnswer={el.correct}
      question={el.question}
      answers={el.incorrect}
      questionNumber={index}
      handleClick={handleOnHold}
      over={checked}
      isNewGame={chosenOption.length === 0 && !checked}
    />
  ));

  const handleSubmit = (event) => {
    event.preventDefault();
    let countCorrect = 0;
    chosenOption.map((item) => item.correct === item.chosen && countCorrect++);
    setResult(countCorrect);
    setChecked(true);
  };

  const restartQuiz = useCallback(() => {
    setNewQuiz((prevState) => !prevState);
    setChecked(false);
    setResult("");
    setChosenOption([]);
  }, []);

  const returnHandler = useCallback(() => {
    navigate('/start');
  }, [navigate]);

  return (
    <div className="quizPage">
      <Button onClick={returnHandler} className="back-button">
      <img alt='back btn' src="https://img.icons8.com/fluency-systems-filled/48/FFFFFF/chevron-left--v2.png"/>
      </Button>

      {isLoading ? <Loader /> :  <div className="quiz-form">
        {getQuiz}
        <div className="quiz-result">
          {checked ? (
            <>
              <h3>You scored {result}/{configuration.state.number} correct answers</h3>
              <Button onClick={restartQuiz} className="quiz-button">
                New quiz
              </Button>
            </>
          ) : !error ? (
            <Button onClick={handleSubmit} className="quiz-button">
              Check answers
            </Button>
          ) : (
            <Button onClick={restartQuiz} className="quiz-button">
              Try again
            </Button>
          )}
        </div>
      </div>}
    </div>
  );
};

export default QuizPage;
