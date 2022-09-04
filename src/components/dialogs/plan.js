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
  Typography,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import apiService from "../../services/apiService";
import { useRecoilState, useRecoilValue } from "recoil";
import { TwitterPicker } from "react-color";
import {
  activeProjectIdState,
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
        },
        "& .color-input": {
          margin: theme.spacing(1),
          display: "inline-block",
          "& p": {
            marginBottom: theme.spacing(0.5),
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

const PlanDialog = (props) => {
  const classes = useStyles();

  const activeProjectId = useRecoilValue(activeProjectIdState);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState(activeProjectId || "");
  const [reporter, setReporter] = useState("");
  const [color, setColor] = useState("#00D084");

  const [allUsers, setAllUsers] = useRecoilState(allUsersState);
  const [allProjects, setAllProjects] = useRecoilState(allProjectsState);

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
    setReporter("");
    setColor("#00D084");
  };

  const handleCreate = () => {
    props.handleCreate({
      name,
      description,
      projectId,
      reporter,
      color,
    });
    props.handleClose();
    resetFields();
  };

  useEffect(() => {
    apiService.get("/api/user").then((res) => {
      setAllUsers(res.data);
    });
    if (allProjects.length === 0) {
      apiService.get("/api/project").then((res) => {
        setAllProjects(res.data);
      });
    }
  }, []);

  return (
    <Dialog
      className={classes.root}
      open={props.open}
      onClose={props.handleClose}
      maxWidth="lg"
    >
      <DialogTitle className="title">Create Plan</DialogTitle>
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
            <InputLabel>Reporter*</InputLabel>
            <Select
              value={reporter}
              label="Reporter*"
              onChange={(e) => setReporter(e.target.value)}
            >
              {projectColloborators.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className="color-input">
            <Typography>Color Code{"  "}</Typography>
            <TwitterPicker
              color={color}
              onChangeComplete={(c, e) => setColor(c.hex)}
              triangle="hide"
            />
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

export default PlanDialog;
