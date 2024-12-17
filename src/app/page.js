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
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks');
        setTasks(response.data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setAlert({ message: 'Failed to load tasks. Please try again later.', type: 'error' });
      }
    };
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask.title || !newTask.dueDate || !newTask.description) {
      setAlert({ message: 'All fields are required.', type: 'error' });
      return;
    }
    try {
      const response = await axios.post('/api/tasks', newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', dueDate: '', description: '' });
      setAlert({ message: 'Task added successfully!', type: 'success' });
    } catch (error) {
      console.error('Error adding task:', error);
      setAlert({ message: 'Error adding task. Please try again.', type: 'error' });
    }
  };

  const updateTask = async () => {
    if (!editingTask.title || !editingTask.dueDate || !editingTask.description) {
      setAlert({ message: 'All fields are required.', type: 'error' });
      return;
    }
    try {
      const response = await axios.put(`/api/tasks/${editingTaskId}`, editingTask);
      setTasks(tasks.map(task => task._id === editingTaskId ? response.data : task));
      setEditingTaskId(null);
      setEditingTask({ title: '', dueDate: '', description: '' });
      setAlert({ message: 'Task updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error updating task:', error);
      setAlert({ message: 'Error updating task. Please try again.', type: 'error' });
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      setAlert({ message: 'Task deleted successfully!', type: 'success' });
    } catch (error) {
      console.error('Error deleting task:', error);
      setAlert({ message: 'Error deleting task. Please try again.', type: 'error' });
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditingTask({ title: task.title, dueDate: task.dueDate, description: task.description });
  };

  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-xl font-semibold mb-4">Task Manager</h1>

        {alert.message && (
          <div className={`p-4 rounded-md text-white ${alert.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
            {alert.message}
          </div>
        )}

        <form className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-md"
            placeholder="Task Title"
            value={editingTaskId ? editingTask.title : newTask.title}
            onChange={(e) => editingTaskId ? setEditingTask({...editingTask, title: e.target.value}) : setNewTask({...newTask, title: e.target.value})}
          />
          <input
            type="date"
            className="border border-gray-300 p-2 rounded-md"
            value={editingTaskId ? editingTask.dueDate : newTask.dueDate}
            onChange={(e) => editingTaskId ? setEditingTask({...editingTask, dueDate: e.target.value}) : setNewTask({...newTask, dueDate: e.target.value})}
          />
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-md"
            placeholder="Description"
            value={editingTaskId ? editingTask.description : newTask.description}
            onChange={(e) => editingTaskId ? setEditingTask({...editingTask, description: e.target.value}) : setNewTask({...newTask, description: e.target.value})}
          />
          <button
            type="button"
            onClick={editingTaskId ? updateTask : addTask}
            className="md:col-span-3 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            {editingTaskId ? 'Update Task' : 'Add Task'}
          </button>
        </form>

        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Due Date</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="bg-white">
                <td className="px-6 py-4">{task.title}</td>
                <td className="px-6 py-4">{format(new Date(task.dueDate), 'PP')}</td>
                <td className="px-6 py-4">{task.description}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEditClick(task)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-red-600 hover:underline ml-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskManager;
