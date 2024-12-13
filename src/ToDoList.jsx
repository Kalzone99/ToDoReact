import React, { useState } from "react";

const ToDoList = () => {
  const [toDo, setToDo] = useState([]);
  const [toDoAdd, setToDoAdd] = useState("");

  const handleToDoChange = (event) => {
    setToDoAdd(event.target.value);
  };

  const handleAddToDo = () => {
    if (toDoAdd.trim() === "") return; // Prevent adding empty to-dos
    const newToDo = {
      list: toDoAdd,
      date: new Date().toLocaleString("fr-BE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
    setToDo((t) => [...t, newToDo]);
    setToDoAdd("");
  };

  const handleRemoveToDo = (index) => {
    setToDo((t) => t.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <h2 className="title">To Do List</h2>
      <label>New To Do: </label>
      <input
        type="text"
        value={toDoAdd}
        onChange={handleToDoChange}
        placeholder="Enter a task"
      />
      <button onClick={handleAddToDo} id="addButton">
        Add To Do
      </button>
      <ul>
        {toDo.map((item, index) => (
          <div className="theListItems">
            <li key={index}>
              <strong id="task">{item.list}</strong> -{" "}
              {item.date.toLocaleString()}
              <br />
              <div className="buttons">
                <button
                  className="delete"
                  onClick={() => handleRemoveToDo(index)}>
                  Delete
                </button>
                <button className="edit">Edit</button>
              </div>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
