import { useState } from "react"


const Question = (props) => {
  const options = props.answers
  const [currentAnswer, setCurrentAnswer] = useState('')


  const decideStyle = (answer) => {
    let buttonStyles = {backgroundColor: "#F5F7FB"} 
    //style incorrect answer
    if (answer===currentAnswer && currentAnswer!==decodeURIComponent(props.correctAnswer)) {
      buttonStyles = {
        backgroundColor: "#F8BCBC",
        borderColor: "#F8BCBC",
      }
    } 
    //style correct answer
    if (answer===decodeURIComponent(props.correctAnswer)) {
      buttonStyles = {
        backgroundColor: "#94D7A2",
        borderColor: "#94D7A2",
        opacity: 1
      }
    }  
    return buttonStyles
  }

  const chosenStyle = (answer) => {
    let style = {backgroundColor: "#F5F7FB"}
    if (answer===currentAnswer) {
      style = {
        backgroundColor: "#D6DBF5",
        borderColor: "#D6DBF5"
      }
    }
    return style
  }

  const usualStyle = {backgroundColor: "#F5F7FB"};
  
  const getStyles = (option) => {
    let style = usualStyle;
    if (props.isNewGame) {
      return decideStyle(option);
    }
    style = props.over ? decideStyle(option) : chosenStyle(option);
    return style;
  }

  const getOptions = options.map(el => {
    const option = decodeURIComponent(el)
    let styles = getStyles(option);
  
    return <button className={`optionButton ${(props.over || props.isNewGame) && "resultOptionButton"}`} 
    key={option}
        disabled={props.over ? true : false}
        onClick={() => {
          setCurrentAnswer(option)
          props.handleClick(option, props.questionNumber)}}
        style={styles} >{option}</button>
  })

  return (
    <div className="question-container">
      <h3 className="question-title">{props.question}</h3>
      <div className="question-options">
        {getOptions}
      </div>
    </div>
  )
}

export default Question