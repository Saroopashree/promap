import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  Select,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Divider,
  Chip,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import apiService from "../../services/apiService";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  activeProjectIdState,
  allPlansState,
  allProjectsState,
  allUsersState,
} from "../../recoil/atoms";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .title": {
        boxShadow:
          "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
      },
      "& .form": {
        "& .input-el": {
          margin: theme.spacing(1),
          width: "100%",
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
      "& .actions": {
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(1),
      },
    },
  })
);

const TaskDialog = (props) => {
  const classes = useStyles();

  const activeProjectId = useRecoilValue(activeProjectIdState);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState(activeProjectId || "");
  const [assignee, setAssignee] = useState("");
  const [plan, setPlan] = useState(null);

  const [allUsers, setAllUsers] = useRecoilState(allUsersState);
  const allProjects = useRecoilValue(allProjectsState);
  const allPlans = useRecoilValue(allPlansState);

  const projectColloborators = useMemo(() => {
    const project = allProjects.find((p) => p.id === projectId);
    if (!project) {
      return [];
    }

    const colloboratorIds = project?.collaborators;
    return allUsers.filter((u) => colloboratorIds.includes(u.id));
  }, [allUsers, projectId, allProjects]);

  const resetFields = () => {
    setName("");
    setProjectId(projectId);
    setDescription("");
    setAssignee("");
    setPlan(null);
  };

  const handleCreate = () => {
    props.handleCreate({
      name,
      description,
      projectId,
      assignee,
      plan,
    });
    props.handleClose();
    resetFields();
  };

  useEffect(() => {
    apiService.get("/api/user").then((res) => {
      setAllUsers(res.data);
    });
  }, []);

  useEffect(() => {
    setProjectId(activeProjectId);
  }, [activeProjectId]);

  return (
    <Dialog
      className={classes.root}
      open={props.open}
      onClose={props.handleClose}
      maxWidth="lg"
    >
      <DialogTitle className="title">Create Task</DialogTitle>
      <Divider />
      <DialogContent sx={{ minWidth: "500px", width: "50vw" }}>
        <FormGroup className="form">
          <TextField
            className="input-el"
            variant="outlined"
            label="Name*"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            className="input-el"
            variant="outlined"
            label="Description"
            value={description}
            multiline
            rows={5}
            onChange={(e) => setDescription(e.target.value)}
            helperText="Optional"
          />
          <FormControl fullWidth className="input-el">
            <InputLabel>Project*</InputLabel>
            <Select
              value={projectId}
              label="Project*"
              onChange={(e) => setProjectId(e.target.value)}
            >
              {allProjects.map((proj) => (
                <MenuItem key={proj.id} value={proj.id}>
                  {proj.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth className="input-el">
            <InputLabel>Assignee*</InputLabel>
            <Select
              value={assignee}
              label="Assignee*"
              onChange={(e) => setAssignee(e.target.value)}
            >
              {projectColloborators.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth className="input-el">
            <InputLabel>Plan</InputLabel>
            <Select
              value={plan}
              label="Plan"
              onChange={(e) => setPlan(e.target.value)}
              renderValue={(value) => {
                const selectedPlan = allPlans.find((p) => p.id === value);
                return (
                  <Chip
                    className="plan-chip"
                    deleteIcon={null}
                    sx={{ backgroundColor: selectedPlan.color }}
                    label={selectedPlan.name}
                  />
                );
              }}
            >
              {allPlans.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Box className="actions">
          <Button variant="text" onClick={props.handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCreate}>
            Create
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
