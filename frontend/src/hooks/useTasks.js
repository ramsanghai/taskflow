import { useState, useCallback } from 'react';
import { tasksAPI } from '../services/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, completed: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await tasksAPI.getAll(filters);
      setTasks(res.data.data.tasks);
      setStats(res.data.data.stats);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data) => {
    const res = await tasksAPI.create(data);
    const newTask = res.data.data.task;
    setTasks((prev) => [newTask, ...prev]);
    setStats((prev) => ({
      ...prev,
      total: prev.total + 1,
      [newTask.status]: prev[newTask.status] + 1,
    }));
    return newTask;
  }, []);

  const updateTask = useCallback(async (id, data) => {
    const res = await tasksAPI.update(id, data);
    const updated = res.data.data.task;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          // Update stats for status changes
          return updated;
        }
        return t;
      })
    );
    // Re-fetch to recalculate stats accurately
    return updated;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await tasksAPI.delete(id);
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id);
      if (task) {
        setStats((s) => ({
          ...s,
          total: s.total - 1,
          [task.status]: s[task.status] - 1,
        }));
      }
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  return { tasks, stats, loading, error, fetchTasks, createTask, updateTask, deleteTask };
};
