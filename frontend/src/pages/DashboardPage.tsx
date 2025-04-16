import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
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

const initialData = {
  todo: [],
  inProgress: [],
  done: [],
};

interface KanbanTask {
  title: string;
  description: string;
  deadline: Dayjs | null;
  priority: string;
  status: "todo" | "inProgress" | "done";
  color: string;
}

const DashboardPage: React.FC = () => {
  const [columns, setColumns] =
    useState<Record<string, KanbanTask[]>>(initialData);
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState<KanbanTask>({
    title: "",
    description: "",
    deadline: null,
    priority: "",
    status: "todo",
    color: "#FFCDD2",
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceCol = result.source.droppableId;
    const destCol = result.destination.droppableId;

    const copiedTask = [...columns[sourceCol]];
    const [removed] = copiedTask.splice(result.source.index, 1);
    const updatedSource = copiedTask;

    const updatedDest = [...columns[destCol]];
    updatedDest.splice(result.destination.index, 0, removed);

    setColumns({
      ...columns,
      [sourceCol]: updatedSource,
      [destCol]: updatedDest,
    });
  };

  const handleAddTask = () => {
    setColumns((prev) => ({
      ...prev,
      [newTask.status]: [...prev[newTask.status], newTask],
    }));

    setOpen(false);
    setNewTask({
      title: "",
      description: "",
      deadline: null,
      priority: "medium",
      status: "todo",
      color: "#FFCDD2",
    });
  };

  return (
    <Box display="flex" p={4} gap={3} alignItems="flex-start">
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add Kanban Task
      </Button>

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
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography variant="h6" align="center" fontWeight="bold">
                  {status.toUpperCase()}
                </Typography>

                {tasks.map((task, index) => (
                  <Draggable
                    key={task.title + index}
                    draggableId={task.title + index}
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
                        <Typography variant="body1">{task.title}</Typography>
                        <Typography variant="body2" sx={{ fontSize: 12 }}>
                          {task.description}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: 12 }}>
                          {task.deadline
                            ? `Due: ${task.deadline.format("YYYY-MM-DD")}`
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

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Kanban Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
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
          />

          <DatePicker
            label="Deadline"
            value={newTask.deadline}
            onChange={(newDate) =>
              setNewTask({ ...newTask, deadline: newDate })
            }
            slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
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
                status: e.target.value as KanbanTask["status"],
              })
            }
          >
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="inProgress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </TextField>

          {/* Color Picker */}
          <Box mt={2}>
            <Typography variant="body1" sx={{ mb: 1 }}>
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
