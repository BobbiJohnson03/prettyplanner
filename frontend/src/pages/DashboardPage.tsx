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
  Alert,
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

// Import dnd-kit components and hooks
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";

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

const TITLE_CHAR_LIMIT = 50;
const DESCRIPTION_CHAR_LIMIT = 100;
const CATEGORY_NAME_CHAR_LIMIT = 20;

type KanbanColumnStatus = "todo" | "inProgress" | "done";

// Helper function to check if a string is a valid KanbanColumnStatus
const isValidKanbanColumn = (
  id: string | KanbanColumnStatus
): id is KanbanColumnStatus => {
  return ["todo", "inProgress", "done"].includes(id as KanbanColumnStatus);
};

// Interface for column mapping for dnd-kit
interface ColumnMap {
  [key: string]: KanbanTask[];
}

// Droppable component for columns
interface DroppableColumnProps {
  id: KanbanColumnStatus;
  children: React.ReactNode;
  title: string;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({
  id,
  children,
  title,
}) => {
  return (
    <Droppable droppableId={id}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <Box
          ref={provided.innerRef}
          sx={{
            width: 300,
            minHeight: 400,
            backgroundColor: snapshot.isDraggingOver ? "#2a2a2a" : "#1f1f1f", // Visual feedback when dragging over
            borderRadius: 2,
            p: 2,
            flexShrink: 0,
            transition: "background-color 0.2s ease",
          }}
          {...provided.droppableProps}
        >
          <Typography
            variant="h6"
            align="center"
            sx={{ color: "#f5f5f5", textTransform: "capitalize" }}
          >
            {title}
          </Typography>
          {children}
          {provided.placeholder}{" "}
          {/* Important for drag-and-drop to work visually */}
        </Box>
      )}
    </Droppable>
  );
};

// Draggable component for Kanban Tasks
interface DraggableTaskProps {
  task: KanbanTask;
  index: number;
  handleDeleteTask: (id: string) => void;
  handleEditTask: (task: KanbanTask) => void; // Added prop for editing
}

const DraggableTask: React.FC<DraggableTaskProps> = ({
  task,
  index,
  handleDeleteTask,
  handleEditTask, // Destructure the new prop
}) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps} // Apply drag handle to the whole box
          sx={{
            p: 2,
            m: 1,
            backgroundColor: task.color || "#ccc",
            borderRadius: 2,
            color: "#fff",
            fontWeight: 500,
            cursor: "grab",
            boxShadow: snapshot.isDragging
              ? "0 5px 15px rgba(0,0,0,0.4)"
              : "0 2px 4px rgba(0,0,0,0.2)",
            transform: snapshot.isDragging ? "rotate(2deg)" : "none", // Slight rotation when dragging
            opacity: snapshot.isDragging ? 0.8 : 1, // Make dragged item translucent
            transition:
              "box-shadow 0.1s ease, transform 0.1s ease, opacity 0.1s ease",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="body1"
              sx={{
                flexGrow: 1,
                overflowWrap: "break-word",
                wordBreak: "break-word",
                whiteSpace: "normal",
                marginRight: 1,
                fontWeight: "bold",
              }}
            >
              {task.title}
            </Typography>
            <Box sx={{ flexShrink: 0 }}>
              <IconButton
                size="small"
                onClick={() => handleEditTask(task)} // Call handleEditTask with the task
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
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              overflowWrap: "break-word",
              wordBreak: "break-word",
              whiteSpace: "normal",
              fontSize: "0.85rem",
              color: "#ddd",
            }}
          >
            {task.description}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {task.deadline
              ? `Due: ${dayjs(task.deadline).format("YYYY-MM-DD")}`
              : "No deadline"}
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
            Priority: {task.priority} {task.category && `(${task.category})`}
          </Typography>
        </Box>
      )}
    </Draggable>
  );
};

const DashboardPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;

  const {
    data: tasks = [],
    refetch,
    isFetching,
  } = useGetTasksByUserQuery(userId!, {
    skip: !userId,
  });
  const { data: categories = [], refetch: refetchCategories } =
    useGetCategoriesByUserQuery(userId!, {
      skip: !userId,
    });

  const [addTask] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [columns, setColumns] = useState<ColumnMap>({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#E6E6E3");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null); // New state for task being edited

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: null as Dayjs | null,
    priority: "medium",
    status: "todo" as KanbanColumnStatus,
    color: "#FFCDD2",
    category: "",
  });

  // Function to reset the new task form state (used for both add and edit after save/close)
  const resetNewTaskForm = () => {
    setNewTask({
      title: "",
      description: "",
      deadline: null,
      priority: "medium",
      status: "todo",
      color: "#FFCDD2",
      category: "",
    });
    setEditingTask(null); // Clear editing task state
  };

  // Effect to synchronize tasks from RTK Query with local columns state
  // This useEffect ensures the local 'columns' state reflects the 'tasks' data from RTK Query.
  // It's crucial for initial load and after refetches.
  useEffect(() => {
    // LOG: Triggered when tasks or isFetching changes
    console.log("useEffect triggered. Current tasks from RTK Query:", tasks);
    if (!isFetching) {
      const mapped: ColumnMap = { todo: [], inProgress: [], done: [] };
      tasks.forEach((task) => {
        if (isValidKanbanColumn(task.status)) {
          mapped[task.status].push(task);
        } else {
          console.warn(
            `Task with invalid status found: ${task.status} for task ID: ${task.id}. Defaulting to 'todo'.`
          );
          mapped.todo.push(task);
        }
      });
      // Sort tasks within each column by orderIndex
      Object.keys(mapped).forEach((k) => {
        mapped[k as KanbanColumnStatus].sort(
          (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
        );
      });

      // Deep compare to prevent unnecessary re-renders when data is the same
      if (JSON.stringify(mapped) !== JSON.stringify(columns)) {
        // LOG: Setting columns state with new mapped data
        console.log("useEffect: Setting columns state with new mapped data.");
        setColumns(mapped);
      }
    }
  }, [tasks, isFetching]); // Depend on tasks and isFetching to trigger updates

  // Handle opening task dialog for editing
  const handleEditTask = (taskToEdit: KanbanTask) => {
    setEditingTask(taskToEdit); // Store the task being edited
    setNewTask({
      // Populate the form fields with data from the task being edited
      title: taskToEdit.title,
      description: taskToEdit.description,
      // Convert ISO string deadline to Dayjs object if it exists
      deadline: taskToEdit.deadline ? dayjs(taskToEdit.deadline) : null,
      priority: taskToEdit.priority,
      status: taskToEdit.status as KanbanColumnStatus, // Ensure type consistency
      color: taskToEdit.color,
      category: taskToEdit.category,
    });
    setOpenAddTaskDialog(true); // Open the dialog
  };

  const handleSaveTask = async () => {
    if (!userId) {
      alert("Please log in to save tasks.");
      return;
    }
    if (!newTask.title.trim()) {
      alert("Task title is required!");
      return;
    }
    if (!newTask.category.trim()) {
      alert("Task category is required!");
      return;
    }

    const trimmedTitle = newTask.title.slice(0, TITLE_CHAR_LIMIT);
    const trimmedDescription = newTask.description.slice(
      0,
      DESCRIPTION_CHAR_LIMIT
    );
    const finalDeadline = newTask.deadline
      ? newTask.deadline.toISOString()
      : new Date().toISOString(); // Fallback to current date if no deadline

    // Common payload structure for both add and update
    const commonPayload = {
      title: trimmedTitle,
      description: trimmedDescription,
      deadline: finalDeadline,
      priority: newTask.priority,
      status: newTask.status,
      color: newTask.color,
      category: newTask.category,
      userId: userId, // UserId should always be associated
    };

    try {
      if (editingTask) {
        // If editing an existing task
        const updatedTaskPayload: Partial<KanbanTask> = {
          ...commonPayload,
          // For updates, we primarily send what's changed.
          // Keep createdAt from existing task.
          createdAt: editingTask.createdAt,
          // OrderIndex might not be explicitly sent on form edit,
          // it's primarily managed by drag-and-drop.
          // If it needs to be updated here, pull it from existingTask or re-evaluate.
          orderIndex: editingTask.orderIndex,
        };

        await updateTask({
          id: editingTask.id!,
          updated: updatedTaskPayload,
        }).unwrap();

        // Optimistically update the local state for the edited task
        setColumns((prevColumns) => {
          const newCols = { ...prevColumns };
          const oldStatus = editingTask.status;
          const newStatus = newTask.status;

          // If status changed, remove from old column and add to new
          if (oldStatus !== newStatus) {
            newCols[oldStatus] = newCols[oldStatus].filter(
              (t) => t.id !== editingTask.id
            );
            if (!newCols[newStatus]) newCols[newStatus] = [];
            newCols[newStatus].push({
              ...editingTask,
              ...newTask,
              id: editingTask.id!,
              deadline: finalDeadline,
            });
          } else {
            // If status is same, just update the task in its current column
            newCols[newStatus] = newCols[newStatus].map((t) =>
              t.id === editingTask.id
                ? {
                    ...t,
                    ...newTask,
                    id: editingTask.id!,
                    deadline: finalDeadline,
                  }
                : t
            );
          }

          // Re-sort affected columns to ensure orderIndex consistency
          Object.keys(newCols).forEach((k) => {
            newCols[k as KanbanColumnStatus].sort(
              (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
            );
          });
          return newCols;
        });
      } else {
        // If adding a new task
        const newOrderIndex =
          columns[newTask.status].length > 0
            ? Math.max(
                ...columns[newTask.status].map((t) => t.orderIndex || 0)
              ) + 1
            : 0;

        const payload = {
          ...commonPayload,
          createdAt: new Date().toISOString(),
          orderIndex: newOrderIndex,
        };
        const addedTask = await addTask(payload).unwrap();

        // Optimistically update the local 'columns' state for the new task
        setColumns((prevColumns) => {
          const newColumns = { ...prevColumns };
          if (!newColumns[addedTask.status]) {
            newColumns[addedTask.status] = [];
          }
          newColumns[addedTask.status] = [
            ...newColumns[addedTask.status],
            addedTask,
          ];
          newColumns[addedTask.status].sort(
            (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
          );
          return newColumns;
        });
      }

      await refetch(); // Final refetch to ensure UI is fully synchronized with backend
      setOpenAddTaskDialog(false); // Close dialog
      resetNewTaskForm(); // Reset form fields
    } catch (err) {
      console.error("Error saving task:", err);
      // Detailed error handling for user feedback (similar to existing logic)
      if (typeof err === "object" && err !== null) {
        const fetchError = err as FetchBaseQueryError;
        if (fetchError.data) {
          try {
            const errorData =
              typeof fetchError.data === "string"
                ? JSON.parse(fetchError.data)
                : fetchError.data;
            if (
              errorData &&
              typeof errorData === "object" &&
              "errors" in errorData
            ) {
              const validationErrors = Object.values(errorData.errors)
                .flat()
                .join(". ");
              alert(
                `Validation Error: ${
                  validationErrors ||
                  "One or more fields are invalid. Check console for details."
                }`
              );
            } else if (
              errorData &&
              typeof errorData === "object" &&
              "message" in errorData
            ) {
              alert(`Error from server: ${errorData.message}`);
            } else {
              alert(
                "An unexpected error occurred. Please check console for raw backend error data."
              );
            }
          } catch (parseError) {
            console.error(
              "Failed to parse backend error data as JSON:",
              fetchError.data,
              parseError
            );
            alert(
              "An unknown error occurred. Please check console for details."
            );
          }
        } else {
          alert(
            "An unexpected error occurred. No details from server. Check network tab."
          );
        }
      } else {
        alert(
          "An unknown error occurred while saving task. Please check console for details."
        );
      }
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id).unwrap();
      await refetch(); // Refetch to remove the task from the UI
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      await refetchCategories(); // Refetch categories list
      await refetch(); // Refetch tasks too, in case tasks using this category need re-evaluation (as per backend logic)
    } catch (error) {
      console.error("Failed to delete category:", error);
      if (typeof error === "object" && error !== null && "data" in error) {
        console.error("Backend error details (raw):", error);
        console.error(
          "Backend error data (JSON):",
          JSON.stringify((error as any).data, null, 2)
        );
      }
      alert(
        `Error deleting category: ${
          (error as any).data?.message || "Check console for details."
        }`
      );
    }
  };

  const handleSaveCategory = async () => {
    if (!userId) {
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
    const trimmedCategoryName = categoryName.slice(0, CATEGORY_NAME_CHAR_LIMIT);

    try {
      if (editingCategoryId) {
        const existingCategory = categories.find(
          (c) => c.id === editingCategoryId
        );
        if (existingCategory) {
          await updateCategory({
            id: editingCategoryId,
            updated: {
              ...existingCategory,
              name: trimmedCategoryName,
              color: categoryColor,
            },
          }).unwrap();
        } else {
          console.error(
            "Attempted to edit a category that does not exist locally."
          );
          alert("Could not find category to update.");
          return;
        }
      } else {
        await addCategory({
          name: trimmedCategoryName,
          color: categoryColor,
          userId,
        }).unwrap();
      }
      await refetchCategories(); // Refresh categories list
      setCategoryName("");
      setCategoryColor("#E6E6E3");
      setEditingCategoryId(null);
      setShowCategoryForm(false);
    } catch (error) {
      console.error("Failed to save category:", error);
      if (typeof error === "object" && error !== null && "data" in error) {
        console.error("Backend error details (raw):", error);
        console.error(
          "Backend error data (JSON):",
          JSON.stringify((error as any).data, null, 2)
        );
      }
      alert(
        `Error saving category: ${
          (error as any).data?.message || "Check console for details."
        }`
      );
    }
  };

  // @hello-pangea/dnd `onDragEnd` handler
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // 1. Dropped outside a droppable area
    if (!destination) {
      console.log(
        "Dropped outside valid droppable area. Reverting UI to last fetched state."
      );
      await refetch(); // Revert UI to match backend (discard optimistic update)
      return;
    }

    // 2. Identify source and destination columns/tasks
    const sourceColId = source.droppableId as KanbanColumnStatus;
    const destColId = destination.droppableId as KanbanColumnStatus;

    if (!isValidKanbanColumn(sourceColId) || !isValidKanbanColumn(destColId)) {
      console.error(
        "Invalid source or destination column ID during drag end. Reverting UI."
      );
      await refetch(); // Revert UI
      return;
    }

    // Find the task being dragged from the current local state
    const draggedTask = columns[sourceColId].find((t) => t.id === draggableId);
    if (!draggedTask) {
      console.error(
        "Dragged task not found in source column during handleDragEnd. Reverting UI."
      );
      await refetch(); // Revert UI
      return;
    }

    // Deep clone current columns for safe optimistic update
    const newColumns: ColumnMap = JSON.parse(JSON.stringify(columns));

    const sourceTasks = newColumns[sourceColId];
    const destTasks = newColumns[destColId];

    // Prepare updates for backend based on the new order/status
    const updatesForBackend: { id: string; updated: Partial<KanbanTask> }[] =
      [];

    // Case 1: Moving within the same column
    if (sourceColId === destColId) {
      const reorderedTasks = Array.from(sourceTasks); // Create a fresh array for reordering
      const [movedItem] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedItem);

      // Optimistic UI update
      // LOG: Before optimistic update
      console.log(
        "Optimistic UI Update: New columns state (same column move):",
        JSON.parse(
          JSON.stringify({ ...newColumns, [sourceColId]: reorderedTasks })
        )
      );
      setColumns((prev) => ({
        ...prev,
        [sourceColId]: reorderedTasks, // Update the specific column with the new order
      }));

      // Queue updates for all tasks in this column, ensuring their new orderIndex
      reorderedTasks.forEach((task, index) => {
        updatesForBackend.push({ id: task.id, updated: { orderIndex: index } });
      });
    }
    // Case 2: Moving to a different column
    else {
      // Remove from source column
      const [movedItem] = sourceTasks.splice(source.index, 1);
      // Update the status of the moved item in the local state copy
      movedItem.status = destColId;
      // Insert into destination column
      destTasks.splice(destination.index, 0, movedItem);

      // Optimistic UI update
      // LOG: Before optimistic update
      console.log(
        "Optimistic UI Update: New columns state (cross-column move):",
        JSON.parse(
          JSON.stringify({
            ...newColumns,
            [sourceColId]: sourceTasks,
            [destColId]: destTasks,
          })
        )
      );
      setColumns((prev) => ({
        ...prev,
        [sourceColId]: sourceTasks, // Source column is now missing the dragged item
        [destColId]: destTasks, // Destination column has the dragged item
      }));

      // Queue updates for backend
      // 1. Update the moved task's status and its new order index in the destination column
      updatesForBackend.push({
        id: movedItem.id,
        updated: { status: destColId, orderIndex: destination.index },
      });

      // 2. Re-index all tasks in the source column
      sourceTasks.forEach((task, index) => {
        updatesForBackend.push({ id: task.id, updated: { orderIndex: index } });
      });

      // 3. Re-index all tasks in the destination column (excluding the one just moved, handled above)
      destTasks.forEach((task, index) => {
        // We ensure `movedItem`'s orderIndex is set by its direct update above.
        // Other items in the dest column might also need orderIndex updates if they shifted.
        if (task.id !== draggedTask.id) {
          // Only update if it's not the task that was just moved
          updatesForBackend.push({
            id: task.id,
            updated: { orderIndex: index },
          });
        }
      });
    }

    // Execute all backend updates
    try {
      for (const update of updatesForBackend) {
        // Ensure id is not null before attempting update
        if (update.id) {
          await updateTask(update).unwrap();
        }
      }
      // After all backend updates are sent, refetch to ensure ultimate consistency
      // This refetch should ideally just confirm the optimistic state, not fight it.
      await refetch();
      console.log("Drag and drop successful, UI synchronized with backend.");
    } catch (error) {
      console.error("Failed to complete drag and drop operation:", error);
      alert("Failed to move task. Reverting changes. Please try again.");
      await refetch(); // IMPORTANT: Revert UI to match backend if any API call fails
    }
  };

  return (
    <Box sx={{ backgroundColor: "#181818", minHeight: "100vh", py: 4, px: 2 }}>
      <Box display="flex" justifyContent="center" mb={4}>
        <Button
          variant="outlined"
          onClick={() => {
            setOpenAddTaskDialog(true);
            resetNewTaskForm(); // Ensure form is reset for new task creation
          }}
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

      {/* --- MODIFICATION: Added text "use by drag and drop" --- */}
      <Typography variant="body2" align="center" sx={{ color: "#aaa", mb: 4 }}>
        use by drag and drop
      </Typography>
      {/* --- END MODIFICATION --- */}

      {/* DragDropContext for @hello-pangea/dnd */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box display="flex" justifyContent="center" gap={3} flexWrap="wrap">
          {Object.entries(columns).map(([status, tasksInColumn]) => (
            <DroppableColumn
              id={status as KanbanColumnStatus}
              title={status.replace(/([A-Z])/g, " $1").trim()}
              key={status}
            >
              {tasksInColumn.map((task, index) => (
                <DraggableTask
                  key={task.id}
                  task={task}
                  index={index}
                  handleDeleteTask={handleDeleteTask}
                  handleEditTask={handleEditTask} // Pass the new handler
                />
              ))}
            </DroppableColumn>
          ))}
        </Box>
      </DragDropContext>

      {/* Add/Edit Task Dialog */}
      <Dialog
        open={openAddTaskDialog}
        onClose={() => {
          setOpenAddTaskDialog(false);
          resetNewTaskForm(); // Reset form and editingTask state on dialog close
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { backgroundColor: "#1c1c1c", color: "#f5f5f5", borderRadius: 2 },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#121212",
            color: "#f5f5f5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {editingTask ? "Edit Kanban Task" : "Add Kanban Task"}{" "}
          {/* Dynamic Title */}
          <IconButton
            onClick={() => {
              setOpenAddTaskDialog(false);
              resetNewTaskForm(); // Reset form and editingTask state on dialog close
            }}
            sx={{ color: "#f5f5f5" }}
          >
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
              inputProps: { maxLength: TITLE_CHAR_LIMIT },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#888" },
                "&.Mui-focused fieldset": { borderColor: "#90caf9" },
              },
            }}
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
              inputProps: { maxLength: DESCRIPTION_CHAR_LIMIT },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#888" },
                "&.Mui-focused fieldset": { borderColor: "#90caf9" },
              },
            }}
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
                sx: {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#555" },
                    "&:hover fieldset": { borderColor: "#888" },
                    "&.Mui-focused fieldset": { borderColor: "#90caf9" },
                  },
                },
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
                setNewTask({
                  ...newTask,
                  category: e.target.value,
                  color: "#FFCDD2",
                });
              }
            }}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#f5f5f5" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#888" },
                "&.Mui-focused fieldset": { borderColor: "#90caf9" },
              },
            }}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.name} sx={{ color: "#f5f5f5" }}>
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

          {/* --- MODIFICATION: "+ Add Category" button text changed to "+" --- */}
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
              : showCategoryForm
              ? "Hide Category Form"
              : "+ Add Category"}{" "}
            {/* Changed text here back to "Add Category" */}
          </Button>
          {/* --- END MODIFICATION --- */}

          {showCategoryForm && (
            <Box
              mt={2}
              p={2}
              sx={{
                border: "1px solid #333",
                borderRadius: 2,
                backgroundColor: "#2a2a2a",
              }}
            >
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
                InputProps={{
                  style: { color: "#f5f5f5" },
                  inputProps: { maxLength: CATEGORY_NAME_CHAR_LIMIT },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#555" },
                    "&:hover fieldset": { borderColor: "#888" },
                    "&.Mui-focused fieldset": { borderColor: "#90caf9" },
                  },
                }}
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
                      boxShadow:
                        categoryColor === color ? "0 0 0 1px " + color : "none",
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
                sx={{
                  mt: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#555" },
                    "&:hover fieldset": { borderColor: "#888" },
                    "&.Mui-focused fieldset": { borderColor: "#90caf9" },
                  },
                }}
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
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#888" },
                "&.Mui-focused fieldset": { borderColor: "#90caf9" },
              },
            }}
          >
            <MenuItem value="low" sx={{ color: "#f5f5f5" }}>
              Low
            </MenuItem>
            <MenuItem value="medium" sx={{ color: "#f5f5f5" }}>
              Medium
            </MenuItem>
            <MenuItem value="high" sx={{ color: "#f5f5f5" }}>
              High
            </MenuItem>
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
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#888" },
                "&.Mui-focused fieldset": { borderColor: "#90caf9" },
              },
            }}
          >
            <MenuItem value="todo" sx={{ color: "#f5f5f5" }}>
              To Do
            </MenuItem>
            <MenuItem value="inProgress" sx={{ color: "#f5f5f5" }}>
              In Progress
            </MenuItem>
            <MenuItem value="done" sx={{ color: "#f5f5f5" }}>
              Done
            </MenuItem>
          </TextField>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveTask} // Now calls the combined save function
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
            }}
            startIcon={<AddIcon />}
          >
            {editingTask ? "Save Changes" : "Add Task"}{" "}
            {/* Dynamic Button Text */}
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
