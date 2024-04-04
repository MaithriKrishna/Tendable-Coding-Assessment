import React, { useState, useEffect } from "react";
import { QUESTIONS } from "./questions";

const App = () => {
  const [answer, setAnswer] = useState(0);
  const [score, setScore] = useState(0);
  const [averageScore, setAverageScore] = useState([]);
  const [allScore, setAllScore] = useState([]);

  const handleRadioChange = async (e) => {
    if (e.target.value === "yes") {
      let runScore = (100 * (answer + 1)) / Object.values(QUESTIONS).length;
      setScore(() => runScore);
      setAnswer((answer) => answer + 1);
    }
  };

  const calculateSum = (scores) => {
    if (scores && scores.length) {
      let sum = 0;
      let i = 0;
      for (i = 0; i < scores.length; i++) {
        sum = sum + scores[i];
      }
      return sum;
    }
    return 0;
  };

  const loadAverageScore = async () => {
    try {
      const averageScores = await localStorage.getItem("averageScores");
      let averageScoresArray = JSON.parse(averageScores);
      setAllScore(() => averageScoresArray);
      if (averageScoresArray.length === 1 && averageScoresArray[0]) {
        setAverageScore(() => averageScoresArray);
      } else {
        setAverageScore(() => [
          calculateSum(averageScoresArray) / averageScoresArray.length,
        ]);
      }
      // if (averageScores) {
      //   setAllScore(averageScores);
      //   setAverageScore(sum(...averageScores) / averageScores.length);
      // } else {
      //   setAllScore([]);
      //   setAverageScore(0);
      // }
    } catch (error) {
      console.log("Error loading questions:", error);
    }
  };

  const saveAverageScores = async (responses) => {
    try {
      await localStorage.setItem("averageScores", responses);
    } catch (error) {
      console.error("Error saving user responses:", error);
    }
  };

  useEffect(() => {
    loadAverageScore();
    return () => {
      score && saveAverageScores(JSON.stringify([...allScore, score]));
    };
  }, []);

  useEffect(() => {
    score && saveAverageScores(JSON.stringify([...allScore, score]));
  });

  return (
    <div className="main__wrap">
      <main className="container">
        <div>
          {Object.values(QUESTIONS).map((question) => (
            <>
              <div>{question}</div>
              <label>
                <input type="radio" value="yes" onChange={handleRadioChange} />
                Yes
              </label>
              <label>
                <input type="radio" value="no" onChange={handleRadioChange} />
                No
              </label>
            </>
          ))}
        </div>
        <div>Score is {score}</div>
        {console.log(averageScore)}
        <div>
          Average score is{" "}
          {(averageScore && averageScore.length && averageScore) || 0}
        </div>
      </main>
    </div>
  );
};

export default App;
