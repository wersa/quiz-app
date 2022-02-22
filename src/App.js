import { useState, useEffect } from "react"
import Question from "./components/Question"

function App() {
  const [isActive, setIsActive] = useState(false)
  const [end, setEnd] = useState()
  const [quiz, setQuiz] = useState([])
  const [chosenOption, setChosenOption] = useState([])
  const [result, setResult] = useState()

  useEffect(() => {

    const getQuestions = (data) => {
      const questionsArray = []
      const answersArray = []
      data.map((el, index) => {
        answersArray.push({ correct: decodeURIComponent(el.correct_answer), chosen: "" })
        const options = el.incorrect_answers
        options.push(el.correct_answer)
        shuffle(options)
        return questionsArray.push({ correct: el.correct_answer, incorrect: options, question: decodeURIComponent(el.question) })
      })
      setQuiz(questionsArray)
      setChosenOption(answersArray)
    }
    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array
    }

    if (isActive) {
      fetch("https://opentdb.com/api.php?amount=5&encode=url3986")
        .then(res => res.json())
        .then(data => getQuestions(data.results))
    }
  }, [isActive])

  const handleOnClick = (chosen, questionIndex) => {
    // console.log("handleChange ", chosen)
    // chosenOption.map((item, index) => index === questionIndex ? {...item, chosen: chosen} : prevOption)
    setChosenOption(prevOption => {
      return prevOption.map((item, index) => index === questionIndex ? { ...item, chosen: chosen } : item)
    })
  }

  // const handleOnChange = (questionIndex, chosen) => {
  //    setChosenOption(prevOption => {
  //     return prevOption.map((item, index) => index === questionIndex ? {...item, chosen: chosen} : item)
  //   })
  // }

  console.log("changed ", chosenOption)

  const getQuiz = quiz.map((el, index) =>
    <Question
      key={index}
      correctAnswer={el.correct}
      question={el.question}
      answers={el.incorrect}
      questionNumber={index}
      // changeOption={handleOnChange}
      handleClick={handleOnClick}
      over={end ? true : false}
    />)

  const handleSubmit = (event) => {
    event.preventDefault()
    let countCorrect = 0
    chosenOption.map(item => (item.correct === item.chosen) && countCorrect++)
    setResult(countCorrect)
    setEnd(true)
    setIsActive(false)
  }

  const showQuiz = () => {
    setIsActive(true)
    setResult('')
    setChosenOption([])
    setQuiz([])
  }

  const restartQuiz = () => {
    setIsActive(true)
    setEnd(false)
    setResult('')
    setChosenOption([])
    setQuiz([])
  }

  return (
    <div className="App">
      {(isActive || end)
        ?
        <div className="quizPage">
          <div className="quiz-form">
            {getQuiz}
            <div className="quiz-result">
              {end && <h3>You scored {result}/5 correct answers</h3>}
              <button onClick={!end ? handleSubmit : restartQuiz} className="button quiz-button">{!end ? "Check answers" : "Restart"}</button>

            </div>
          </div>

        </div>
        :
        <div className="startPage">
          <h1>Quizzical</h1>
          <p>You will be given ten questions on completely different topics. Let's see how well you can do.</p>
          <button
            className="button start-button"
            onClick={showQuiz}
          >
            Start quiz
          </button>
        </div>}
    </div>
  );
}

export default App;
