import React, { Suspense } from "react";
import Loader from "./components/Loader";
import { Route, Routes, Navigate } from "react-router-dom";

const QuizPage = React.lazy(() => import("./components/QuizPage"));
const StartPage = React.lazy(() => import("./components/StartPage"));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/start" replace />} />
          <Route path="/start" element={<StartPage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
