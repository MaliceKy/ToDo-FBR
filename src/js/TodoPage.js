import React, { useState, useEffect } from 'react';
import '../css/TodoPage.css';
import { fetchTodosFromFirestore, addTodoToFirestore, editTodoInFirestore, deleteTodoFromFirestore } from '../firebase/todo.firebase';

const TodoPage = ({ username }) => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    if (!username) {
      setError('Username is undefined or empty.');
      console.error('Error: Username is undefined or empty.');
      return;
    }
    const result = await fetchTodosFromFirestore(username);
    if (result.success) {
      setTasks(result.todos);
    } else {
      console.error('Error fetching tasks:', result.message);
      setError(result.message);
    }
  };

  const handleAddTask = async () => {
    if (!task.trim()) {
      setError('Task cannot be empty.');
      return;
    }
    const result = await addTodoToFirestore(username, task);
    if (result.success) {
      setTasks((prevTasks) => [...prevTasks, task]);
      setTask('');
    } else {
      setError(result.message);
    }
  };

  const handleEditTask = async (oldTask) => {
    if (!newTask.trim()) {
      setError('Task cannot be empty.');
      return;
    }
    const result = await editTodoInFirestore(username, oldTask, newTask);
    if (result.success) {
      setTasks((prevTasks) => prevTasks.map(t => t === oldTask ? newTask : t));
      setEditIndex(null);
      setNewTask('');
    } else {
      setError(result.message);
    }
  };

  const handleDeleteTask = async (taskToDelete) => {
    const result = await deleteTodoFromFirestore(username, taskToDelete);
    if (result.success) {
      setTasks((prevTasks) => prevTasks.filter(t => t !== taskToDelete));
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="todo-page">
      <h2>To-Do List</h2>
      <div className="todo-input">
        <input
          type="text"
          placeholder="Enter a new task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <ul className="todo-list">
        {tasks.map((t, index) => (
          <li key={index}>
            {editIndex === index ? (
              <>
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="edit-input"
                />
                <div className="button-group">
                  <button onClick={() => handleEditTask(t)} className="save-button">Save</button>
                  <button onClick={() => setEditIndex(null)} className="cancel-button">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="task-content">
                  <span className="task-text">&bull; {t}</span>
                </div>
                <div className="button-group">
                  <button onClick={() => { setEditIndex(index); setNewTask(t); }} className="edit-button">Edit</button>
                  <button onClick={() => handleDeleteTask(t)} className="delete-button">Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoPage;