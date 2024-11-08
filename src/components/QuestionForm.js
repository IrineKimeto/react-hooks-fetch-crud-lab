
import React, { useState } from "react";

function QuestionForm({ setQuestions = () => {} }) { 
  const [formData, setFormData] = useState({
    prompt: "",
    answers: ["", "", "", ""],
    correctIndex: 0,
  });

  function handleChange(event) {
    if (event.target.name.startsWith("answer")) {
      const index = parseInt(event.target.name.slice(-1)) - 1;
      const newAnswers = [...formData.answers];
      newAnswers[index] = event.target.value;
      setFormData({ ...formData, answers: newAnswers });
    } else {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
      });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: formData.prompt,
        answers: formData.answers,
        correctIndex: parseInt(formData.correctIndex),
      }),
    })
    .then(response => response.json())
    .then(newQuestion => {
      setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    });
  }

  return (
    <section>
      <h1>New Question</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
          />
        </label>
        {formData.answers.map((answer, index) => (
          <label key={index}>
            Answer {index + 1}:
            <input
              type="text"
              name={`answer${index + 1}`}
              value={answer}
              onChange={handleChange}
            />
          </label>
        ))}
        <label>
          Correct Answer:
          <select
            name="correctIndex"
            value={formData.correctIndex}
            onChange={handleChange}
          >
            {formData.answers.map((answer, index) => (
              <option key={index} value={index}>
                {answer || `Answer ${index + 1}`}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Add Question</button>
      </form>
    </section>
  );
}

export default QuestionForm;

