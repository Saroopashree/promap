import { Box, Typography } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { useMemo } from "react";
import TaskCard from "./taskCard";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      gap: theme.spacing(2),
      padding: theme.spacing(2),
      border: "1px solid #ccc",
      "& .kanban-column": {
        padding: theme.spacing(1.5),
        minWidth: "300px",
        "& .column-header": {
          textTransform: "uppercase",
          fontWeight: "bold",
        },
      },
    },
  })
);

const KanbanBoard = ({ project, tasks }) => {
  const classes = useStyles();

  const tasksByStatus = useMemo(() => {
    let _tasksByStatus = Object.fromEntries(
      project.definitions.map((defn) => [defn, []])
    );
    tasks.forEach((task) => {
      _tasksByStatus[task.status].push(task);
    });
    return _tasksByStatus;
  }, [tasks]);

  return (
    <Box className={classes.root}>
      {project.definitions.map((defn, i) => (
        <Box key={i} className="kanban-column">
          <Typography className="column-header">{defn.name}</Typography>
          <Box className="column-tasks">
            {tasksByStatus[defn.name].map((task) => (
              <TaskCard task={task} markDone={Boolean(defn.final)} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default KanbanBoard;
