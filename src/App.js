import { useState, useEffect } from "react";
import Question from "./components/Question";
import { nanoid } from 'nanoid'


function App() {
  const [isActive, setIsActive] = useState(false);
  const [newQuiz, setNewQuiz] = useState(false);
  const [quiz, setQuiz] = useState([]);
  const [chosenOption, setChosenOption] = useState([]);
  const [result, setResult] = useState();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&encode=url3986")
      .then((res) => res.json())
      .then((data) => setQuiz(getQuestions(data.results)));
    console.log("got quiz details");
  }, [newQuiz]);

  const getQuestions = (data) => {
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
    // setQuiz(questionsArray)
    setChosenOption(answersArray);
    return questionsArray;
  };

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleOnHold = (chosen, questionIndex) => {
    setChosenOption((prevOption) => {
      return prevOption.map((item, index) =>
        index === questionIndex ? { ...item, chosen: chosen } : item
      );
    });
  };

  const getQuiz = quiz.map((el, index) => (
    <Question
      key={el.question}
      correctAnswer={el.correct}
      question={el.question}
      answers={el.incorrect}
      questionNumber={index}
      handleClick={handleOnHold}
      over={checked }
      isNewGame={chosenOption.length === 0 && !checked}
    />
  ));

  // console.log(getQuiz);
  const handleSubmit = (event) => {
    event.preventDefault();
    let countCorrect = 0;
    chosenOption.map((item) => item.correct === item.chosen && countCorrect++);
    setResult(countCorrect);
    setChecked(true);

  };

  const showQuiz = () => {
    setIsActive(true);
  };

  const restartQuiz = () => {
    setNewQuiz((prevState) => !prevState);
    setChecked(false);
    setResult("");
    setChosenOption([]);

  };

  return (
    <div className="App">
      {isActive ? (
        <div className="quizPage">
          <div className="quiz-form">
            {getQuiz}
            <div className="quiz-result">
              {checked ? (
                <>
                  <h3>You scored {result}/5 correct answers</h3>
                  <button onClick={restartQuiz} className="button quiz-button">
                    Restart
                  </button>
                </>
              ) : (
                <button onClick={handleSubmit} className="button quiz-button">
                  Check answers
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="startPage">
          <h1>Quizzical</h1>
          <p>
            You will be given ten questions on completely different topics.
            Let's see how well you can do.
          </p>
          <button className="button start-button" onClick={showQuiz}>
            Start quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
