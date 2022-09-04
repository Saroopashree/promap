import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Avatar,
} from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";
import ArrowDown from "@mui/icons-material/ArrowDropDown";
import apiService, { clearAppContents } from "../services/apiService";
import ProjectDialog from "../components/dialogs/project";
import { useSnackbar } from "notistack";
import { useRecoilState } from "recoil";
import {
  allProjectsState,
  activeProjectIdState,
  allPlansState,
  updateTaskNotifierState,
} from "../recoil/atoms";
import { currentUserName } from "../services/lsService";
import PlanDialog from "../components/dialogs/plan";
import TaskDialog from "../components/dialogs/task";
import Link from "next/link";
import { useRouter } from "next/router";

const pages = [];
const settings = [{ name: "Logout", value: "logout" }];

const createItems = [
  { name: "Project", value: "project" },
  { name: "Plan", value: "plan" },
  { name: "Task", value: "task" },
];

const Layout = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElCreate, setAnchorElCreate] = useState(null);
  const [anchorElProject, setAnchorElProject] = useState(null);

  const [dialogType, setDialogType] = useState(null);

  const [projects, setProjects] = useRecoilState(allProjectsState);
  const [activeProjectId, setActiveProjectId] =
    useRecoilState(activeProjectIdState);
  const [plans, setPlans] = useRecoilState(allPlansState);
  const [updateTaskCount, setUpdateTaskCount] = useRecoilState(
    updateTaskNotifierState
  );

  const projectIdAndName = useMemo(() => {
    return Object.fromEntries(projects.map((proj) => [proj.id, proj.name]));
  }, [projects]);

  useEffect(() => {
    setUsername(currentUserName());
  });

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenProjectMenu = (event) => {
    setAnchorElProject(event.currentTarget);
  };
  const handleCloseProjectMenu = () => {
    setAnchorElProject(null);
  };

  const handleOpenCreateMenu = (event) => {
    setAnchorElCreate(event.currentTarget);
  };
  const handleCloseCreateMenu = () => {
    setAnchorElCreate(null);
  };

  const onCreateItemClick = (itemType) => {
    setAnchorElCreate(null);
    setDialogType(itemType);
  };

  const onCreateProject = (project) => {
    apiService.post("/api/project", project).then((res) => {
      enqueueSnackbar(`Project ${res.data.tag} created`, {
        variant: "success",
      });
      setProjects([...projects, res.data]);
      setActiveProjectId(res.data.id);
      router.push(`/kanban/${res.data.id}`);
    });
  };

  const onCreatePlan = (plan) => {
    apiService.post("/api/plan", plan).then((res) => {
      enqueueSnackbar(`Plan ${res.data.name} created`, {
        variant: "success",
      });
      setPlans([...plans, res.data]);
    });
  };

  const onCreateTask = (task) => {
    apiService.post("/api/task", task).then((res) => {
      enqueueSnackbar(`Task created with key ${res.data.key}`, {
        variant: "success",
      });
      setUpdateTaskCount((prev) => prev + 1);
    });
  };

  const goToKanban = (projectId) => {
    handleCloseProjectMenu();
    setActiveProjectId(projectId);
    router.push(`/kanban/${projectId}`);
  };

  return (
    <Box>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Link href="/" style={{ cursor: "pointer" }}>
              <Typography
                variant="h6"
                component="h5"
                noWrap
                sx={{
                  ml: 1,
                  mr: 4,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 600,
                  fontSize: "1.5rem",
                  letterSpacing: ".35rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                ProMap
              </Typography>
            </Link>

            {Boolean(activeProjectId) && (
              <span
                style={{ cursor: "pointer", marginLeft: "36px" }}
                onClick={handleOpenProjectMenu}
              >
                <Typography variant="h6">
                  {projectIdAndName[activeProjectId]}{" "}
                  <ArrowDown sx={{ verticalAlign: "middle" }} />
                </Typography>
              </span>
            )}
            <Menu
              anchorEl={anchorElProject}
              open={Boolean(anchorElProject)}
              onClose={handleCloseProjectMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              {Object.entries(projectIdAndName)
                .filter(([id]) => id !== activeProjectId)
                .map(([id, name]) => (
                  <MenuItem key={id} onClick={() => goToKanban(id)}>
                    {name}
                  </MenuItem>
                ))}
            </Menu>

            <Button
              sx={{ ml: 4 }}
              color="secondary"
              variant="contained"
              onClick={handleOpenCreateMenu}
            >
              Create <ArrowDown />
            </Button>
            <Menu
              anchorEl={anchorElCreate}
              open={Boolean(anchorElCreate)}
              onClose={handleCloseCreateMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
            >
              {createItems.map((item) => (
                <MenuItem
                  sx={{ width: 110 }}
                  key={item.value}
                  onClick={() => onCreateItemClick(item.value)}
                  disabled={projects.length === 0 && item.value !== "project"}
                >
                  {item.name}
                </MenuItem>
              ))}
            </Menu>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={username} sx={{ backgroundColor: "#debb3e" }}>
                  {username.length > 1 ? username[0] : "?"}
                </Avatar>
              </IconButton>
              <Typography
                variant="button"
                color="ButtonText"
                sx={{ color: "#fff", ml: 1, fontSize: "1rem" }}
              >
                {username}
              </Typography>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    clearAppContents();
                  }}
                >
                  <Typography textAlign="center">Log Out</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {children}
      <ProjectDialog
        open={dialogType === "project"}
        handleClose={() => setDialogType(null)}
        handleCreate={onCreateProject}
      />
      <PlanDialog
        open={dialogType === "plan"}
        handleClose={() => setDialogType(null)}
        handleCreate={onCreatePlan}
      />
      <TaskDialog
        open={dialogType === "task"}
        handleClose={() => setDialogType(null)}
        handleCreate={onCreateTask}
      />
    </Box>
  );
};

export default Layout;
