import { Box, Paper, Typography } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import classNames from "classnames";
import { useMemo } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import apiService from "../services/apiService";
import TaskCard from "./taskCard";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      gap: theme.spacing(2),
      alignItems: "stretch",
      padding: theme.spacing(2),
      border: "1px solid #ccc",
      minHeight: "60vh",
      width: "fit-content",
      maxWidth: "100%",
      overflowX: "auto",
      "& .kanban-column": {
        padding: theme.spacing(1.5),
        minWidth: "300px",
        borderRadius: theme.spacing(1),
        border: "1px solid #ccc",
        backgroundColor: "#dcdcdc",
        "& .column-header": {
          textTransform: "uppercase",
          fontWeight: "bold",
        },
      },
      "& .light-blue": {
        backgroundColor: theme.palette.primary.light,
      },
    },
  })
);

const KanbanBoard = ({ project, tasks, updateStatusInRecoil }) => {
  const classes = useStyles();

  const tasksByStatus = useMemo(() => {
    let _tasksByStatus = Object.fromEntries(
      project.definitions.map((defn) => [defn.name, []])
    );
    tasks.forEach((task) => {
      _tasksByStatus[task.status].push(task);
    });
    return _tasksByStatus;
  }, [tasks]);

  const changeTaskStatus = (taskKey, newStatus) => {
    apiService
      .put(`/api/task/${taskKey}/status`, { status: newStatus })
      .then((res) => {
        updateStatusInRecoil(res.data.key, res.data.status);
      });
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId) {
      return;
    }

    const task = tasks.find((task) => task.key === draggableId);
    const newStatus = destination.droppableId
      .replace(/([A-Z])/g, " $1")
      .slice(1);

    updateStatusInRecoil(task.key, newStatus);
    changeTaskStatus(task.key, newStatus);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Paper className={classes.root}>
        {project.definitions.map((defn, i) => (
          <Droppable droppableId={defn.name.replace(" ", "")} key={i}>
            {(provided, snapshot) => (
              <Box
                className={classNames("kanban-column", {
                  "light-blue": snapshot.isDraggingOver,
                })}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <Typography className="column-header">{defn.name}</Typography>
                <Box className="column-tasks">
                  {tasksByStatus[defn.name]?.map((task, index) => (
                    <TaskCard
                      task={task}
                      markDone={Boolean(defn.final)}
                      index={index}
                    />
                  ))}
                  {provided.placeholder}
                </Box>
              </Box>
            )}
          </Droppable>
        ))}
      </Paper>
    </DragDropContext>
  );
};

export default KanbanBoard;
