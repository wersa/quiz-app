import { useState } from "react";

const Question = (props) => {
  const options = props.answers;
  const correctOption = decodeURIComponent(props.correctAnswer);
  const [currentAnswer, setCurrentAnswer] = useState("");

  const getStyles = (option) => {
    let style = "usual";

    if (!props.isNewGame && !props.over && option !== currentAnswer) {
      return style;
    }

    if (!props.over && option === currentAnswer) {
      return (style = "chosen");
    }

    if (props.isNewGame || props.over) {
      if (option === currentAnswer && currentAnswer !== correctOption) {
        return (style = "incorrect");
      }
      if (option === correctOption) {
        return (style = "correct");
      }
    }
  };

  const getOptions = options.map((el) => {
    const option = decodeURIComponent(el);
    let styles = getStyles(option);

    return (
      <button
        className={`optionButton ${
          (props.over || props.isNewGame) && "resultOptionButton"
        } ${styles}`}
        key={option}
        disabled={props.over ? true : false}
        onClick={() => {
          setCurrentAnswer(option);
          props.handleClick(option, props.questionNumber);
        }}
        // style={styles}
      >
        {option}
      </button>
    );
  });

  return (
    <div className="question-container">
      <h3 className="question-title">{props.question}</h3>
      <div className="question-options">{getOptions}</div>
    </div>
  );
};

export default Question;
