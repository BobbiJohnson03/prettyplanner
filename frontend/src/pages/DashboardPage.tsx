import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import {
  useGetTasksByUserQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  KanbanTask,
} from "../redux/kanbanApi";

import {
  useGetCategoriesByUserQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../redux/categoryApi";

const predefinedColors = [
  "#D32F2F",
  "#F57C00",
  "#FBC02D",
  "#388E3C",
  "#00796B",
  "#0288D1",
  "#1976D2",
  "#303F9F",
  "#7B1FA2",
  "#C2185B",
  "#5D4037",
  "#616161",
];

const initialData: Record<"todo" | "inProgress" | "done", KanbanTask[]> = {
  todo: [],
  inProgress: [],
  done: [],
};

const DashboardPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id || user?._id;

  const { data: tasks = [], refetch } = useGetTasksByUserQuery(userId!, {
    skip: !userId,
  });
  const { data: categories = [], refetch: refetchCategories } =
    useGetCategoriesByUserQuery(userId!, { skip: !userId });

  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [addTask] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [columns, setColumns] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#FFCDD2");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: null as Dayjs | null,
    priority: "medium",
    status: "todo" as "todo" | "inProgress" | "done",
    color: "#FFCDD2",
    category: "",
  });

  useEffect(() => {
    const mapped: Record<"todo" | "inProgress" | "done", KanbanTask[]> = {
      todo: [],
      inProgress: [],
      done: [],
    };
    tasks.forEach((task) => {
      mapped[task.status].push(task);
    });
    setColumns(mapped);
  }, [tasks]);

  const handleAddTask = async () => {
    if (!userId) return;
    try {
      await addTask({
        ...newTask,
        userId,
        createdAt: new Date().toISOString(),
        deadline: newTask.deadline?.toISOString(),
      }).unwrap();
      await refetch();
      setOpen(false);
      setNewTask({
        title: "",
        description: "",
        deadline: null,
        priority: "medium",
        status: "todo",
        color: "#FFCDD2",
        category: "",
      });
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    await refetch();
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      await refetchCategories();
      await refetch();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleSaveCategory = async () => {
    if (!userId || !categoryName) return;
    try {
      if (editingCategoryId) {
        await updateCategory({
          id: editingCategoryId,
          updated: { name: categoryName, color: categoryColor },
        }).unwrap();
      } else {
        await addCategory({
          name: categoryName,
          color: categoryColor,
          userId,
        }).unwrap();
      }
      await refetchCategories();
      setCategoryName("");
      setCategoryColor("#FFCDD2");
      setEditingCategoryId(null);
      setShowCategoryForm(false);
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#181818", minHeight: "100vh", py: 4, px: 2 }}>
      <Box display="flex" justifyContent="center" mb={4}>
        <Button
          variant="outlined"
          onClick={() => setOpen(true)}
          sx={{
            color: "#f5f5f5",
            borderColor: "#f5f5f5",
            borderWidth: "2px",
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 500,
            px: 3,
            py: 1.5,
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "#ffffff11",
              borderColor: "#fff",
            },
          }}
        >
          Add Kanban Task
        </Button>
      </Box>

      <Box display="flex" justifyContent="center" gap={3} flexWrap="wrap">
        {Object.entries(columns).map(([status, tasks]) => (
          <Box
            key={status}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (!draggedTaskId) return;
              const sourceCol = Object.entries(columns).find(([_, tasks]) =>
                tasks.some((task) => task.id === draggedTaskId)
              )?.[0] as "todo" | "inProgress" | "done";
              if (!sourceCol) return;
              const draggedTask = columns[sourceCol].find(
                (t) => t.id === draggedTaskId
              );
              if (!draggedTask) return;
              const updatedTask = { ...draggedTask, status };
              updateTask({ id: draggedTask.id, updated: updatedTask });
              setColumns((prev) => ({
                ...prev,
                [sourceCol]: prev[sourceCol].filter(
                  (t) => t.id !== draggedTaskId
                ),
                [status]: [...prev[status], updatedTask],
              }));
              setDraggedTaskId(null);
            }}
            sx={{
              width: 300,
              minHeight: 400,
              backgroundColor: "#1f1f1f",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography variant="h6" align="center" sx={{ color: "#f5f5f5" }}>
              {status.toUpperCase()}
            </Typography>
            {tasks.map((task) => (
              <Box
                key={task.id}
                draggable
                onDragStart={() => setDraggedTaskId(task.id)}
                sx={{
                  p: 2,
                  m: 1,
                  backgroundColor: task.color || "#ccc",
                  borderRadius: 2,
                  color: "#fff",
                  fontWeight: 500,
                  cursor: "grab",
                }}
              >
                <Box display="flex" justifyContent="space-between">
                  <Typography>{task.title}</Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => {
                        console.log("TODO: Open edit modal for", task.id);
                      }}
                    >
                      <EditNoteIcon sx={{ color: "#fff" }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <DeleteIcon sx={{ color: "#fff" }} />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2">{task.description}</Typography>
                <Typography variant="body2">
                  {task.deadline
                    ? `Due: ${dayjs(task.deadline).format("YYYY-MM-DD")}`
                    : "No deadline"}
                </Typography>
                <Typography variant="caption">
                  Priority: {task.priority}{" "}
                  {task.category && `(${task.category})`}
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ backgroundColor: "#121212", color: "#f5f5f5" }}>
          Add Kanban Task
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#1c1c1c" }}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#f5f5f5" } }}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#f5f5f5" } }}
          />
          <DatePicker
            label="Deadline"
            disablePast
            value={newTask.deadline}
            onChange={(date) => setNewTask({ ...newTask, deadline: date })}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "normal",
                InputLabelProps: { style: { color: "#ccc" } },
                InputProps: { style: { color: "#f5f5f5" } },
              },
            }}
          />
          <TextField
            select
            label="Category"
            fullWidth
            margin="normal"
            value={newTask.category}
            onChange={(e) => {
              const cat = categories.find((c) => c.name === e.target.value);
              if (cat) {
                setNewTask({
                  ...newTask,
                  category: cat.name,
                  color: cat.color,
                });
              }
            }}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#f5f5f5" } }}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.name}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        backgroundColor: c.color,
                        mr: 1,
                      }}
                    />
                    {c.name}
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategoryName(c.name);
                        setCategoryColor(c.color);
                        setEditingCategoryId(c.id);
                        setShowCategoryForm(true);
                      }}
                    >
                      ✏️
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(c.id);
                      }}
                    >
                      🗑️
                    </IconButton>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <Button
            onClick={() => {
              setShowCategoryForm(!showCategoryForm);
              if (!showCategoryForm) {
                setEditingCategoryId(null);
                setCategoryName("");
                setCategoryColor("#FFCDD2");
              }
            }}
            sx={{ color: "#90caf9", mt: 1 }}
          >
            {editingCategoryId ? "Edit Category" : "+ Add Category"}
          </Button>

          {showCategoryForm && (
            <Box mt={2}>
              <TextField
                label="Category Name"
                fullWidth
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                margin="normal"
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{ style: { color: "#f5f5f5" } }}
              />
              <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                {predefinedColors.map((color) => (
                  <Box
                    key={color}
                    onClick={() => setCategoryColor(color)}
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      backgroundColor: color,
                      cursor: "pointer",
                      border:
                        categoryColor === color ? "2px solid #fff" : "none",
                    }}
                  />
                ))}
              </Box>
              <TextField
                label="Custom HEX"
                value={categoryColor}
                onChange={(e) => setCategoryColor(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{ style: { color: "#f5f5f5" } }}
                sx={{ mt: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleSaveCategory}
                sx={{ mt: 2 }}
              >
                {editingCategoryId ? "Update Category" : "Save Category"}
              </Button>
            </Box>
          )}

          <TextField
            select
            label="Priority"
            fullWidth
            margin="normal"
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#f5f5f5" } }}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>

          <TextField
            select
            label="Status"
            fullWidth
            margin="normal"
            value={newTask.status}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                status: e.target.value as "todo" | "inProgress" | "done",
              })
            }
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#f5f5f5" } }}
          >
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="inProgress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </TextField>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddTask}
            sx={{ mt: 3 }}
          >
            Add Task
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
