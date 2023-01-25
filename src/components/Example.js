import React, {useState} from 'react'

const Child = (props) => {
    const [childState, setChildState] = useState(props.hi);

    const childGreeting = childState;

    console.log('second cons', props.hi, childState)

    return (
        <div>{childGreeting}</div>
    )
}

const Example = () => {
    const [state, setState] = useState('hi');

    const greeting = state;

    console.log(state, greeting);
  return (
    <>
    <Child hi={greeting} />
    <button onClick={() => setState(prev => prev + 'i')}>Change greeting</button>
    </>
  );
}

export default Example