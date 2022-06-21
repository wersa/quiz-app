import QuizPage from "./components/QuizPage";
import StartPage from "./components/StartPage";
import { Route, Routes } from "react-router-dom";


function App() {

  return (
    <div className="App">
    <Routes>
    <Route path="/" element={<StartPage />} />

      <Route path="/start" element={<StartPage />}>
        
      </Route>
      <Route path="/quiz" element={<QuizPage />}>
      </Route>
      </Routes>
    </div>
  );
}

export default App;
