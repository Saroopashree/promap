import { useEffect, useState } from "react";
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
  OutlinedInput,
  Divider,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import apiService from "../../services/apiService";
import { useRecoilState } from "recoil";
import { allUsersState } from "../../recoil/atoms";

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
      },
      "& .actions": {
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(1),
      },
    },
  })
);

const ProjectDialog = (props) => {
  const classes = useStyles();

  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [lead, setLead] = useState("");
  const [description, setDescription] = useState("");
  const [collaborators, setCollaborators] = useState([]);

  const [allUsers, setAllUsers] = useRecoilState(allUsersState);

  const handleCreate = () => {
    props.handleCreate({ name, description, tag, lead, collaborators });
  };

  useEffect(() => {
    apiService.get("/api/user").then((res) => {
      setAllUsers(res.data);
    });
  }, []);

  const calculateTag = () => {
    const possibleTag = [...name.matchAll(/[A-Z]/g)].join("");
    setTag(possibleTag);
  };

  const addLeadAsACollaborator = () => {
    if (collaborators.includes(lead)) {
      return;
    } else {
      setCollaborators([lead, ...collaborators]);
    }
  };

  useEffect(addLeadAsACollaborator, [lead]);

  return (
    <Dialog
      className={classes.root}
      open={props.open}
      onClose={props.handleClose}
      maxWidth="lg"
    >
      <DialogTitle className="title">Create Project</DialogTitle>
      <Divider />
      <DialogContent sx={{ minWidth: "500px", width: "50vw" }}>
        <FormGroup className="form">
          <TextField
            className="input-el"
            variant="outlined"
            label="Name*"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={calculateTag}
          />
          <TextField
            className="input-el"
            variant="outlined"
            label="Tag*"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            helperText="Tag once fixed cannot be changed later"
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
            <InputLabel>Project Lead*</InputLabel>
            <Select
              value={lead}
              label="Project Lead*"
              onChange={(e) => setLead(e.target.value)}
            >
              {allUsers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth className="input-el">
            <InputLabel>Colloborators</InputLabel>
            <Select
              multiple
              value={collaborators}
              onChange={(e) => setCollaborators(e.target.value)}
              input={<OutlinedInput label="Colloborators" />}
            >
              {allUsers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
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

export default ProjectDialog;
