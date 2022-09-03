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
  Tooltip,
  Avatar,
} from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";
import ArrowDown from "@mui/icons-material/ArrowDropDown";
import apiService from "../services/apiService";
import ProjectDialog from "../components/dialogs/project";
import { useSnackbar } from "notistack";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  allProjectsState,
  activeProjectState,
  sessionTokenState,
} from "../recoil/atoms";
import { currentUserName } from "../services/lsService";

const pages = [];
const settings = [];

const createItems = [
  { name: "Project", value: "project" },
  { name: "Plan", value: "plan" },
  { name: "Task", value: "task" },
];

const Layout = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElCreate, setAnchorElCreate] = useState(null);

  const [dialogType, setDialogType] = useState(null);

  const [projects, setProjects] = useRecoilState(allProjectsState);
  const [activeProject, setActiveProject] = useRecoilState(activeProjectState);
  const token = useRecoilValue(sessionTokenState);

  const username = useMemo(() => currentUserName(), [token]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
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
    });
  };

  return (
    <Box>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
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

            {Boolean(activeProject) && (
              <Typography variant="h6">{activeProject.name}</Typography>
            )}
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
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
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
    </Box>
  );
};

export default Layout;
