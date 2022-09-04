import { useMemo } from "react";
import {
  Avatar,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import classNames from "classnames";
import {
  allPlansState,
  allUsersState,
  tasksInKanbanState,
} from "../recoil/atoms";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useRecoilState, useRecoilValue } from "recoil";
import apiService from "../services/apiService";
import { Draggable } from "react-beautiful-dnd";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      marginBlock: theme.spacing(1.5),
      paddingBlock: theme.spacing(1),
      width: "100%",
      "& .header": {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
      "& .task-name": {
        width: "30ch",
        marginBlock: theme.spacing(1),
        overflow: "hidden",
        display: "-webkit-box",
        "-webkit-line-clamp": 2,
        "-webkit-box-orient": "vertical",
      },
      "& .done": {
        textDecoration: "line-through",
        color: "#aaa",
      },
      "& .footer": {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        "& .plan-chip": {
          padding: theme.spacing(0.5),
          fontSize: "0.7rem",
          textTransform: "uppercase",
          fontWeight: "bold",
          color: "#fff",
          borderRadius: theme.spacing(0.5),
          "& .MuiChip-label": {
            color: "#fff",
            padding: 0,
          },
        },
      },
    },
  })
);

const TaskCard = ({ task, markDone = false, index }) => {
  const classes = useStyles();

  const [tasksInKanban, setTasksInKanban] = useRecoilState(tasksInKanbanState);
  const allPlans = useRecoilValue(allPlansState);
  const allUsers = useRecoilValue(allUsersState);

  const plan = useMemo(
    () => allPlans.find((plan) => plan.id === task.plan),
    [allPlans, task.plan]
  );

  const assignee = useMemo(
    () => allUsers.find((user) => user.id === task.assignee)?.username,
    [allUsers, task.assignee]
  );

  const handleDelete = () => {
    apiService.delete(`/api/task/${task.key}`).then(() => {
      setTasksInKanban((prev) => prev.filter((t) => t.key !== task.key));
    });
  };

  return (
    <Draggable draggableId={task.key} index={index}>
      {(provided) => (
        <Card
          className={classes.root}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <CardContent>
            <Box className="header">
              <Typography
                className={classNames({ done: markDone })}
                variant="caption"
              >
                {markDone && (
                  <DoneIcon
                    sx={{ verticalAlign: "bottom" }}
                    fontSize="small"
                    color="success"
                  />
                )}{" "}
                {task.key}
              </Typography>
              <IconButton onClick={handleDelete}>
                <CloseIcon fontSize="small" color="error" />
              </IconButton>
            </Box>
            <Typography className="task-name" variant="subtitle1">
              {task.name}
            </Typography>
            <Box className="footer">
              {Boolean(plan) ? (
                <Chip
                  className="plan-chip"
                  deleteIcon={null}
                  sx={{ backgroundColor: plan.color }}
                  label={plan.name}
                />
              ) : (
                <span></span>
              )}
              <Tooltip title={assignee} placement="bottom">
                <Avatar alt={assignee} sx={{ backgroundColor: "#debb3e" }}>
                  {assignee.length > 1 ? assignee[0] : "?"}
                </Avatar>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default TaskCard;
