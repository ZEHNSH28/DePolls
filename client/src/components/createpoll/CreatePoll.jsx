import React, { useState } from "react";
import "./createpollstyle.css";

const CreatePoll = ({ state }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pollData = {
      title,
      description,
      options,
    };
    const { contract } = state;
    console.log(pollData.options);
    const transaction = await contract.createPoll(pollData.title, pollData.description, pollData.options);
    transaction.wait();
  };

  const handleOptionChange = (e) => {
    setNewOption(e.target.value);
  };

  const handleAddOption = (e) => {
    e.preventDefault();
    if (newOption.trim() === "") {
      return;
    }
    setOptions([...options, newOption]);
    setNewOption("");
  };

  return (
    <>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label>Options</label>
            <ul>
              {options.map((option, index) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
            <input
              type="text"
              value={newOption}
              onChange={handleOptionChange}
            />
            <button className="addOption" onClick={handleAddOption}>Add Option</button>
          </div>
          <button type="submit">Create Poll</button>
        </form>
    </>
  );
};

export default CreatePoll;
