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
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

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
  Category,
} from "../redux/categoryApi";

const predefinedColors = [
  "#D32F2F", // Red
  "#F57C00", // Orange
  "#FBC02D", // Yellow
  "#388E3C", // Green
  "#00796B", // Teal
  "#0288D1", // Light Blue
  "#1976D2", // Blue
  "#303F9F", // Indigo
  "#7B1FA2", // Purple
  "#C2185B", // Pink
  "#5D4037", // Brown
  "#616161", // Grey
  "#E6E6E3", // Default light grey from backend
];

// Define column types for Kanban board
type KanbanColumnStatus = "todo" | "inProgress" | "done";

const initialData: Record<KanbanColumnStatus, KanbanTask[]> = {
  todo: [],
  inProgress: [],
  done: [],
};

const DashboardPage: React.FC = () => {
  // Get user from Redux state
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;

  // RTK Query hooks for tasks and categories
  const { data: tasks = [], refetch } = useGetTasksByUserQuery(userId!, {
    skip: !userId,
  });
  const { data: categories = [], refetch: refetchCategories } =
    useGetCategoriesByUserQuery(userId!, { skip: !userId });

  // RTK Query mutations
  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [addTask] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // State for Kanban columns (local UI state derived from fetched tasks)
  const [columns, setColumns] = useState(initialData);
  // State for Add Task dialog open/close
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
  // State for dragged task ID (for drag-and-drop)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // State for category form visibility
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  // State for category name input
  const [categoryName, setCategoryName] = useState("");
  // State for category color input
  const [categoryColor, setCategoryColor] = useState("#E6E6E3");
  // State for category being edited (if any)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );

  // State for new task form fields
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: null as Dayjs | null,
    priority: "medium",
    status: "todo" as KanbanColumnStatus,
    color: "#FFCDD2",
    category: "", // Initialize as empty string
  });

  // Define new character limits for title and description
  const TITLE_CHAR_LIMIT = 20; // Changed to 20
  const DESCRIPTION_CHAR_LIMIT = 40; // Changed to 40

  useEffect(() => {
    const mapped: Record<KanbanColumnStatus, KanbanTask[]> = {
      todo: [],
      inProgress: [],
      done: [],
    };
    tasks.forEach((task) => {
      if (task.status && task.status in mapped) {
        mapped[task.status].push(task);
      } else {
        console.warn(`Task with invalid status found: ${task.status} for task ID: ${task.id}. Defaulting to 'todo'.`);
        mapped.todo.push(task);
      }
    });
    // Only update state if the new mapped object is different from the current state
    if (JSON.stringify(mapped) !== JSON.stringify(columns)) {
      setColumns(mapped);
    }
  }, [tasks, columns]);

  // Handles adding a new task
  const handleAddTask = async () => {
    if (!userId) {
      console.error("User not logged in. Cannot add task.");
      alert("Please log in to add tasks.");
      return;
    }

    // Frontend Validation for required fields
    if (!newTask.title.trim()) {
      alert("Task title is required!");
      return;
    }
    if (!newTask.category.trim()) {
      alert("Task category is required!");
      return;
    }

    // Ensure title and description adhere to character limits before sending to backend
    const trimmedTitle = newTask.title.slice(0, TITLE_CHAR_LIMIT);
    const trimmedDescription = newTask.description.slice(0, DESCRIPTION_CHAR_LIMIT);


    const finalDeadline = newTask.deadline ? newTask.deadline.toISOString() : new Date().toISOString();

    try {
      const payload = {
        title: trimmedTitle, // Use trimmed title
        description: trimmedDescription, // Use trimmed description
        deadline: finalDeadline,
        priority: newTask.priority,
        status: newTask.status,
        color: newTask.color,
        category: newTask.category,
        userId: userId,
        createdAt: new Date().toISOString(),
      };

      await addTask(payload).unwrap();

      await refetch();
      setOpenAddTaskDialog(false);
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
      if (typeof err === "object" && err !== null) {
        const fetchError = err as FetchBaseQueryError;
        if (fetchError.data) {
          try {
            const errorData = typeof fetchError.data === 'string' ? JSON.parse(fetchError.data) : fetchError.data;
            console.error("Backend error data (parsed):", errorData);
            if (errorData && typeof errorData === 'object' && 'errors' in errorData) {
                const validationErrors = Object.values(errorData.errors).flat().join(". ");
                alert(`Validation Error: ${validationErrors || 'One or more fields are invalid. Check console for details.'}`);
            } else if (errorData && typeof errorData === 'object' && 'message' in errorData) {
                alert(`Error from server: ${errorData.message}`);
            } else {
                alert("An unexpected error occurred. Please check console for raw backend error data.");
            }
          } catch (parseError) {
            console.error("Failed to parse backend error data as JSON:", fetchError.data, parseError);
            alert("An unknown error occurred. Please check console for details.");
          }
        } else {
          console.error("Backend error data is empty or malformed.");
          alert("An unexpected error occurred. No details from server. Check network tab.");
        }
      } else {
        alert("An unknown error occurred while adding task. Please check console for details.");
      }
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id).unwrap();
      await refetch();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      await refetchCategories();
      await refetch();
    } catch (error) {
      console.error("Failed to delete category:", error);
      if (typeof error === "object" && error !== null && "data" in error) {
        console.error("Backend error details (raw):", error);
        console.error("Backend error data (JSON):", JSON.stringify((error as any).data, null, 2));
      }
      alert(`Error deleting category: ${(error as any).data?.message || 'Check console for details.'}`);
    }
  };

  const handleSaveCategory = async () => {
    if (!userId) {
      console.error("User not logged in. Cannot save category.");
      alert("Please log in to save categories.");
      return;
    }
    if (!categoryName.trim()) {
      alert("Category Name is required!");
      return;
    }

    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(categoryColor)) {
      alert("Invalid HEX color format. Please use #RRGGBB or #RGB.");
      return;
    }

    try {
      if (editingCategoryId) {
        const existingCategory = categories.find((c) => c.id === editingCategoryId);
        if (existingCategory) {
          await updateCategory({
            id: editingCategoryId,
            updated: {
              ...existingCategory,
              name: categoryName,
              color: categoryColor,
            },
          }).unwrap();
        } else {
          console.error("Attempted to edit a category that does not exist locally.");
          alert("Could not find category to update.");
          return;
        }
      } else {
        await addCategory({
          name: categoryName,
          color: categoryColor,
          userId,
        }).unwrap();
      }
      await refetchCategories();
      setCategoryName("");
      setCategoryColor("#E6E6E3");
      setEditingCategoryId(null);
      setShowCategoryForm(false);
    } catch (error) {
      console.error("Failed to save category:", error);
      if (typeof error === "object" && error !== null && "data" in error) {
        console.error("Backend error details (raw):", error);
        console.error("Backend error data (JSON):", JSON.stringify((error as any).data, null, 2));
        alert(`Error saving category: ${(error as any).data?.message || 'Check console for details.'}`);
      } else {
        alert("An unknown error occurred while saving category.");
      }
    }
  };

  const handleDrop = async (targetStatus: KanbanColumnStatus) => {
    if (!draggedTaskId) return;

    const sourceCol = Object.keys(columns).find((key) =>
      columns[key as KanbanColumnStatus].some((task) => task.id === draggedTaskId)
    ) as KanbanColumnStatus | undefined;

    if (!sourceCol) {
      console.warn("Dragged task not found in any column.");
      return;
    }

    const draggedTask = columns[sourceCol].find(
      (t) => t.id === draggedTaskId
    );

    if (!draggedTask) {
      console.warn("Dragged task object not found.");
      return;
    }

    const updatedTaskForBackend = { ...draggedTask, status: targetStatus };

    try {
      await updateTask({
        id: draggedTask.id,
        updated: updatedTaskForBackend,
      }).unwrap();
      await refetch();
    } catch (error) {
      console.error("Failed to update task status on drop:", error);
      if (typeof error === "object" && error !== null && "data" in error) {
        console.error("Backend error details (raw):", error);
        console.error("Backend error data (JSON):", JSON.stringify((error as any).data, null, 2));
      }
      alert(`Error updating task status: ${(error as any).data?.message || 'Check console for details.'}`);
    } finally {
      setDraggedTaskId(null);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#181818", minHeight: "100vh", py: 4, px: 2 }}>
      <Box display="flex" justifyContent="center" mb={4}>
        <Button
          variant="outlined"
          onClick={() => setOpenAddTaskDialog(true)}
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
        {Object.entries(columns).map(([status, tasksInColumn]) => (
          <Box
            key={status}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(status as KanbanColumnStatus)}
            sx={{
              width: 300,
              minHeight: 400,
              backgroundColor: "#1f1f1f",
              borderRadius: 2,
              p: 2,
              flexShrink: 0,
            }}
          >
            <Typography variant="h6" align="center" sx={{ color: "#f5f5f5", textTransform: 'capitalize' }}>
              {status.replace(/([A-Z])/g, ' $1').trim()}
            </Typography>
            {tasksInColumn.map((task) => (
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
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  {/* Visual Fix: Ensure title wraps and doesn't overflow */}
                  <Typography
                    variant="body1"
                    sx={{
                      flexGrow: 1,
                      overflowWrap: 'break-word', // Breaks long words
                      wordBreak: 'break-word', // For older browsers
                      whiteSpace: 'normal', // Ensure wrapping
                      marginRight: 1, // Space between title and icons
                      fontWeight: 'bold'
                    }}
                  >
                    {task.title}
                  </Typography>
                  <Box sx={{ flexShrink: 0 }}> {/* Prevent icons from pushing title */}
                    <IconButton
                      size="small"
                      onClick={() => {
                        console.log("TODO: Open edit modal for", task.id);
                      }}
                    >
                      <EditIcon sx={{ color: "#fff" }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <DeleteIcon sx={{ color: "#fff" }} />
                    </IconButton>
                  </Box>
                </Box>
                {/* Visual Fix: Ensure description wraps and doesn't overflow */}
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                    fontSize: '0.85rem', // Slightly smaller font for description
                    color: '#ddd'
                  }}
                >
                  {task.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {task.deadline
                    ? `Due: ${dayjs(task.deadline).format("YYYY-MM-DD")}`
                    : "No deadline"}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                  Priority: {task.priority}{" "}
                  {task.category && `(${task.category})`}
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      {/* Add Task Dialog (remains same as previous version) */}
      <Dialog
        open={openAddTaskDialog}
        onClose={() => setOpenAddTaskDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { backgroundColor: "#1c1c1c", color: "#f5f5f5", borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ backgroundColor: "#121212", color: "#f5f5f5", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Add Kanban Task
          <IconButton onClick={() => setOpenAddTaskDialog(false)} sx={{ color: '#f5f5f5' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            required
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{
              style: { color: "#f5f5f5" },
              inputProps: { maxLength: TITLE_CHAR_LIMIT } // Character limit for the input
            }}
            sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#555" }, "&:hover fieldset": { borderColor: "#888" }, "&.Mui-focused fieldset": { borderColor: "#90caf9" } } }}
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
            InputProps={{
              style: { color: "#f5f5f5" },
              inputProps: { maxLength: DESCRIPTION_CHAR_LIMIT } // Character limit for the input
            }}
            sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#555" }, "&:hover fieldset": { borderColor: "#888" }, "&.Mui-focused fieldset": { borderColor: "#90caf9" } } }}
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
                sx: { "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#555" }, "&:hover fieldset": { borderColor: "#888" }, "&.Mui-focused fieldset": { borderColor: "#90caf9" } } },
              },
            }}
          />
          <TextField
            select
            label="Category"
            fullWidth
            margin="normal"
            required
            value={newTask.category}
            onChange={(e) => {
              const cat = categories.find((c) => c.name === e.target.value);
              if (cat) {
                setNewTask({
                  ...newTask,
                  category: cat.name,
                  color: cat.color,
                });
              } else {
                setNewTask({ ...newTask, category: e.target.value, color: "#FFCDD2" });
              }
            }}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#f5f5f5" } }}
            sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#555" }, "&:hover fieldset": { borderColor: "#888" }, "&.Mui-focused fieldset": { borderColor: "#90caf9" } } }}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.name} sx={{ color: '#f5f5f5' }}>
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
                      <EditIcon fontSize="small" sx={{ color: "#aaa" }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(c.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" sx={{ color: "#aaa" }} />
                    </IconButton>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <Button
            onClick={() => {
              if (editingCategoryId) {
                setEditingCategoryId(null);
                setCategoryName("");
                setCategoryColor("#E6E6E3");
              }
              setShowCategoryForm(!showCategoryForm);
            }}
            sx={{ color: "#90caf9", mt: 1 }}
            startIcon={showCategoryForm ? <CloseIcon /> : <AddIcon />}
          >
            {editingCategoryId
              ? "Close Edit Category"
              : (showCategoryForm ? "Hide Category Form" : "+ Add Category")}
          </Button>

          {showCategoryForm && (
            <Box mt={2} p={2} sx={{ border: '1px solid #333', borderRadius: 2, backgroundColor: '#2a2a2a' }}>
              <Typography variant="h6" sx={{ color: "#f5f5f5", mb: 1 }}>
                {editingCategoryId ? "Edit Category" : "New Category"}
              </Typography>
              <TextField
                label="Category Name"
                fullWidth
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                margin="normal"
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{ style: { color: "#f5f5f5" } }}
                sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#555" }, "&:hover fieldset": { borderColor: "#888" }, "&.Mui-focused fieldset": { borderColor: "#90caf9" } } }}
              />
              <Typography variant="body2" sx={{ color: "#ccc", mt: 2, mb: 1 }}>
                Select Color:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
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
                      boxShadow: categoryColor === color ? '0 0 0 1px ' + color : 'none',
                    }}
                  />
                ))}
              </Box>
              <TextField
                label="Custom HEX Color (e.g., #RRGGBB)"
                value={categoryColor}
                onChange={(e) => setCategoryColor(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{ style: { color: "#f5f5f5" } }}
                sx={{ mt: 2, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#555" }, "&:hover fieldset": { borderColor: "#888" }, "&.Mui-focused fieldset": { borderColor: "#90caf9" } } }}
              />
              <Button
                variant="contained"
                onClick={handleSaveCategory}
                sx={{ mt: 2 }}
                startIcon={<SaveIcon />}
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
            sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#555" }, "&:hover fieldset": { borderColor: "#888" }, "&.Mui-focused fieldset": { borderColor: "#90caf9" } } }}
          >
            <MenuItem value="low" sx={{ color: '#f5f5f5' }}>Low</MenuItem>
            <MenuItem value="medium" sx={{ color: '#f5f5f5' }}>Medium</MenuItem>
            <MenuItem value="high" sx={{ color: '#f5f5f5' }}>High</MenuItem>
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
                status: e.target.value as KanbanColumnStatus,
              })
            }
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#f5f5f5" } }}
            sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#555" }, "&:hover fieldset": { borderColor: "#888" }, "&.Mui-focused fieldset": { borderColor: "#90caf9" } } }}
          >
            <MenuItem value="todo" sx={{ color: '#f5f5f5' }}>To Do</MenuItem>
            <MenuItem value="inProgress" sx={{ color: '#f5f5f5' }}>In Progress</MenuItem>
            <MenuItem value="done" sx={{ color: '#f5f5f5' }}>Done</MenuItem>
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
