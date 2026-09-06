import { useState } from "react";
import "./App.css";

function App(){
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [batchInput, setBatchInput] = useState("");
  const [batchResponses, setBatchResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInput.trim()) {
      return;
    }

    try{
      setLoading(true);
      setResponse("");

      const res = await fetch("http://localhost:5000/api/chat",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput,
        }),
      });

      const data = await res.json();

      if(!res.ok){
        throw new Error(data.message || "Something went wrong");
      }

      setResponse(data.response);
    }
    catch (error) {
      setResponse(`Error: ${error.message}`);
    } finally{
      setLoading(false);
    }
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();

    const inputs = batchInput
      .split("\n")
      .map((input) => input.trim())
      .filter((input) => input !== "");

    if(inputs.length === 0){
      return;
    }

    try{
      setBatchLoading(true);
      setBatchResponse([]);

      const res = await fetch("http://localhost:5000/api/chat/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInputs: inputs,
        }),
      });

      const data = await res.json();

      if(!res.ok){
        throw new Error(data.message || "Something went wrong");
      }

      setBatchResponse(data.responses);
    }
    catch (error) {
      setBatchResponse([`Error: ${error.message}`]);
    }
    finally{
      setBatchLoading(false);
    }
  };

  return(
    <div className="app">
      <header className="header">
        <h1>PromptFlow AI</h1>
        <p>AI Prompt Processing Application</p>
      </header>

      <main className="container">

      {/* single prompt */}
        <section className="card">
          <h2>Single Prompt</h2>

          <form onSubmit={handleSubmit}>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter your question..."
              rows="5"
            />
            
            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Send Prompt"}
            </button>
          </form>

          {response && (
            <div className="response">
              <h3>Response</h3>
              <p>{response}</p>
            </div>
          )}
        </section>

        {/* Batch Prompt */}
        <section className="card">
          <h2>Batch Prompts</h2>

          <p className="help-text">
            Enter one question per line
          </p>

          <form onSubmit={handleBatchSubmit}>
            <textarea 
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              placeholder={
                "What is React?\nWhat is Node.js?\nWhat is MongoDB?"
              }
              rows="7"
            />

            <button type="submit" disabled={batchLoading}>
              {batchLoading ? "Processing..." : "Process Batch"}
            </button>
          </form>

          {batchResponses.length > 0 && (
            <div className="response">
              <h3>Batch Responses</h3>

              {batchResponses.map((item, index) => (
                <div className="batch-item" key={index}>
                  <strong>Response {index + 1}</strong>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      
      </main>
    </div>
  );
}

export default App;