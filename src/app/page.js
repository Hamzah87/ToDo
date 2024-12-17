'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', dueDate: '', description: '' });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState({ title: '', dueDate: '', description: '' });
  const [alert, setAlert] = useState({ message: '', type: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setAlert({ message: 'Failed to load tasks. Please try again later.', type: 'error' });
    }
  };

  const addTask = async () => {
    if (!newTask.title || !newTask.dueDate || !newTask.description) {
      setAlert({ message: 'All fields are required.', type: 'error' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
      return;
    }
    try {
      const response = await axios.post('/api/tasks', newTask);
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setNewTask({ title: '', dueDate: '', description: '' });
      setAlert({ message: 'Task added successfully!', type: 'success' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error adding task:', error);
      setAlert({ message: 'Error adding task. Please try again.', type: 'error' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
    }
  };

  const updateTask = async () => {
    if (!editingTask.title || !editingTask.dueDate || !editingTask.description) {
      setAlert({ message: 'All fields are required.', type: 'error' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
      return;
    }
    try {
      const response = await axios.put(`/api/tasks/${editingTaskId}`, editingTask);
      setTasks(tasks.map((t) => (t._id === editingTaskId ? response.data : t)));
      setEditingTaskId(null);
      setEditingTask({ title: '', dueDate: '', description: '' });
      setAlert({ message: 'Task updated successfully!', type: 'success' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error updating task:', error);
      setAlert({ message: 'Error updating task. Please try again.', type: 'error' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
      setAlert({ message: 'Task deleted successfully!', type: 'success' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error deleting task:', error);
      setAlert({ message: 'Error deleting task. Please try again.', type: 'error' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditingTask({ ...task });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">To-Do List</h1>

        {/* Display Alert */}
        {alert.message && (
          <div
            className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 w-80 text-center text-white rounded-md shadow-lg ${
              alert.type === 'error' ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            {alert.message}
          </div>
        )}

        {/* Button to navigate to the /api/tasks page using a link */}
        <a
          href="/api/tasks"
          target="_blank"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-2 mb-2 inline-block"
        >
          View All Tasks
        </a>

        {/* New Task Form */}
        <div className="flex flex-wrap items-center mb-6 space-x-4">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task Title"
            className="flex-1 p-2 border rounded-md shadow-sm text-black mb-2 sm:mb-0"
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            onClick={(e) => e.target.showPicker()} // Trigger the date picker
            className="p-2 border rounded-md mb-2 sm:mb-0 sm:w-auto text-black cursor-pointer"
          />
          <input
            type="text"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Description"
            className="flex-1 p-2 border rounded-md shadow-sm mb-2 sm:mb-0 text-black"
          />
          <button onClick={addTask} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Add Task
          </button>
        </div>

        {/* Task List */}
        <ul className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li key={task._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-md shadow-sm">
                {editingTaskId === task._id ? (
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      name="title"
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                      className="w-full p-1 border rounded text-gray-800"
                    />
                    <textarea
                      name="description"
                      value={editingTask.description}
                      onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                      className="w-full p-1 border rounded text-gray-800"
                      rows="2"
                    />
                    <input
                      type="date"
                      name="dueDate"
                      value={editingTask.dueDate}
                      onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                      className="w-full p-1 border rounded text-gray-800"
                    />
                    <button onClick={updateTask} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <h2 className="font-semibold text-gray-800">{task.title}</h2>
                      <p className="text-gray-600">{task.description}</p>
                      <p className="text-gray-400 text-sm">Due: {format(new Date(task.dueDate), 'MMMM dd, yyyy')}</p>
                    </div>
                    <div className="space-x-2">
                      <button onClick={() => handleEditClick(task)} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                        Edit
                      </button>
                      <button onClick={() => deleteTask(task._id)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          ) : (
            <li className="text-center text-gray-500">No tasks available</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TaskManager;
