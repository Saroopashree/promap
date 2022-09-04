import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import classNames from "classnames";
import { allPlansState, tasksInKanbanState } from "../recoil/atoms";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useRecoilState } from "recoil";
import apiService from "../services/apiService";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      marginBlock: theme.spacing(1.5),
      paddingBlock: theme.spacing(1),
      width: "100%",
      "& .task-name": {
        marginBlock: theme.spacing(1),
        overflow: "hidden",
        display: "-webkit-box",
        "-webkit-line-clamp": 2,
        "-webkit-box-orient": "vertical",
      },
      "& .done": {
        textDecoration: "line-through",
      },
      "& .footer": {
        display: "flex",
        justifyContent: "space-between",
        "& .plan-chip": {
          padding: theme.spacing(0.5),
          textTransform: "uppercase",
          fontWeight: "bold",
          color: "#fff",
          borderRadius: theme.spacing(0.5),
          "& .MuiChip-label": {
            color: "#fff",
          },
        },
      },
    },
  })
);

const TaskCard = ({ task, markDone = false }) => {
  const classes = useStyles();

  const [tasksInKanban, setTasksInKanban] = useRecoilState(tasksInKanbanState);
  const allPlans = useRecoilValue(allPlansState);

  const plan = useMemo(
    () => allPlans.find((plan) => plan.id === task.planId),
    [allPlans, task.planId]
  );

  const username = useMemo(() => currentUserName(), []);

  const handleDelete = () => {
    apiService.delete(`/tasks/${task.id}`).then(() => {
      setTasksInKanban((prev) => prev.filter((t) => t.id !== task.id));
    });
  };

  return (
    <Card className={classes.root}>
      <CardHeader>
        <Box>
          <Typography
            className={classNames({ done: markDone })}
            variant="caption"
          >
            {markDone && <DoneIcon fontSize="small" color="success" />}{" "}
            {task.key}
          </Typography>
          <IconButton onClick={handleDelete}>
            <CloseIcon fontSize="small" color="error" />
          </IconButton>
        </Box>
      </CardHeader>
      <CardContent>
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
          <Avatar alt={username} sx={{ backgroundColor: "#debb3e" }}>
            {username.length > 1 ? username[0] : "?"}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
