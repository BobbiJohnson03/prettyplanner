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
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { ChromePicker } from "react-color";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  useGetTasksByUserQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  KanbanTask,
} from "../redux/kanbanApi";

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

  const [addTask] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [columns, setColumns] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: null as Dayjs | null,
    priority: "medium",
    status: "todo" as "todo" | "inProgress" | "done",
    color: "#FFCDD2",
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
      });
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const sourceCol = result.source.droppableId as
      | "todo"
      | "inProgress"
      | "done";
    const destCol = result.destination.droppableId as
      | "todo"
      | "inProgress"
      | "done";

    const task = columns[sourceCol][result.source.index];
    const updatedTask = { ...task, status: destCol };

    const updatedSource = [...columns[sourceCol]];
    updatedSource.splice(result.source.index, 1);
    const updatedDest = [...columns[destCol]];
    updatedDest.splice(result.destination.index, 0, updatedTask);

    setColumns({
      ...columns,
      [sourceCol]: updatedSource,
      [destCol]: updatedDest,
    });

    await updateTask({ id: task.id, updated: updatedTask });
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    await refetch();
  };

  return (
    <Box sx={{ backgroundColor: "#181818", minHeight: "100vh", py: 4, px: 2 }}>
      {/* Top Button */}
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

      {/* Kanban Columns */}
      <Box display="flex" justifyContent="center" gap={3} flexWrap="wrap">
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.entries(columns).map(([status, tasks]) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    width: 300,
                    minHeight: 400,
                    backgroundColor: "#1f1f1f",
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    align="center"
                    fontWeight="bold"
                    sx={{ color: "#f5f5f5" }}
                  >
                    {status.toUpperCase()}
                  </Typography>

                  {tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            p: 2,
                            m: 1,
                            backgroundColor: task.color || "#ccc",
                            borderRadius: 2,
                            fontWeight: 500,
                            color: "#fff",
                          }}
                        >
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body1">
                              {task.title}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <DeleteIcon sx={{ color: "#fff" }} />
                            </IconButton>
                          </Box>
                          <Typography variant="body2" sx={{ fontSize: 12 }}>
                            {task.description}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: 12 }}>
                            {task.deadline
                              ? `Due: ${dayjs(task.deadline).format(
                                  "YYYY-MM-DD"
                                )}`
                              : "No deadline"}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: "bold" }}
                          >
                            Priority: {task.priority}
                          </Typography>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </Box>

      {/* Modal Dialog */}
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
            margin="normal"
            multiline
            rows={3}
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#f5f5f5" } }}
          />
          <DatePicker
            label="Deadline"
            value={newTask.deadline}
            onChange={(newDate) =>
              setNewTask({ ...newTask, deadline: newDate })
            }
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
          <Box mt={2}>
            <Typography variant="body1" sx={{ mb: 1, color: "#f5f5f5" }}>
              Choose Task Color:
            </Typography>
            <ChromePicker
              color={newTask.color}
              onChange={(color) => setNewTask({ ...newTask, color: color.hex })}
            />
          </Box>
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
