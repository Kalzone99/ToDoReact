import React, { useState, useEffect } from "react";

const API_URL = "https://675b11f69ce247eb19358cca.mockapi.io/api/td1/tasks";

const ToDoList_1 = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null); //for the update fct... useState(null) is used to initialize editingId, meaning no task is being edited initially
  const [editingText, setEditingText] = useState("");

  // Fetch tasks from server
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setTasks(data.sort((a, b) => a.order - b.order))); // Sort and set tasks in order
  }, []);

  // Add a new task
  const addTask = async () => {
    if (newTask.trim() !== "") {
      //to not allow empty to dos to be clicked in the list
      const newTaskObj = {
        text: newTask,
        order: tasks.length, //to get them in order in the db to move them up or down the list (! does not change place in db rather gives a key order)
      };

      fetch(API_URL, {
        method: "POST", //method to add something in a db
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTaskObj),
      })
        .then((response) => response.json())
        .then((createdTask) => {
          setTasks((prevTasks) => [...prevTasks, createdTask]);
          setNewTask("");
        });
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Start editing a task
  const startEditing = (id, text) => {
    //we need the id (automatically generated by the json server, and the text content)
    setEditingId(id);
    setEditingText(text);
  };

  // Save the edited task
  const saveEdit = async () => {
    if (!editingText.trim()) return;

    try {
      const response = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT", //put method is the update method
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editingText }),
      });
      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map(
          (task) =>
            task.id === editingId ? { ...task, text: updatedTask.text } : task //if changes spread the previous object and update else give it as such
        )
      );
      setEditingId(null);
      setEditingText("");
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  // Move a task up
  const moveTaskUp = (index) => {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [
        updatedTasks[index - 1],
        updatedTasks[index], //Bro Code trick
      ];
      setTasks(updatedTasks);
    }
  };

  // Move a task down
  const moveTaskDown = (index) => {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [
        updatedTasks[index + 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  };

  return (
    <div className="to-do-list">
      <h1>To Do List</h1>
      <div>
        <input
          type="text"
          placeholder="Enter a task ..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="add-button" onClick={addTask}>
          Add
        </button>
      </div>
      <ul>
        {tasks.map((task, index) => (
          <li key={task.id}>
            {editingId === task.id ? (
              <>
                <input
                  className="input-edit"
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button className="save-button" onClick={saveEdit}>
                  &#x1F4BE;
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setEditingId(null)}>
                  &#x274C;
                </button>
              </>
            ) : (
              <>
                <span className="text">{task.text}</span>
                <button
                  className="edit-button"
                  onClick={() => startEditing(task.id, task.text)}>
                  &#x1FA84;
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}>
                  &#128465;
                </button>
                <button
                  className="move-up-button"
                  onClick={() => moveTaskUp(index)}>
                  &uarr;
                </button>
                <button
                  className="move-down-button"
                  onClick={() => moveTaskDown(index)}>
                  &darr;
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList_1;
