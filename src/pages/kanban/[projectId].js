import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import {
  Autocomplete,
  Box,
  Checkbox,
  Chip,
  Typography,
  TextField,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  activeProjectIdState,
  allPlansState,
  allProjectsState,
  tasksInKanbanState,
  updateTaskNotifierState,
} from "../../recoil/atoms";
import apiService from "../../services/apiService";
import Layout from "../../theme/layout";
import KanbanBoard from "../../components/kanbanBoard";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      paddingBlock: theme.spacing(4),
      paddingInline: theme.spacing(12),
      "& main": {
        paddingBlock: theme.spacing(3),
        "& .plans-filter": {
          marginBottom: theme.spacing(2),
          "& .option-chip": {
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
    },
  })
);

const KanbanScreen = () => {
  const classes = useStyles();

  const router = useRouter();
  const { projectId } = router.query;

  // Regular React States
  const [filteredPlans, setFilteredPlans] = useState([]);

  // Recoil States and Values
  const [allPlans, setAllPlans] = useRecoilState(allPlansState);
  const [tasksInBoard, setTasksInBoard] = useRecoilState(tasksInKanbanState);
  const [allProjects, setAllProjects] = useRecoilState(allProjectsState);
  const updateTaskNotifier = useRecoilValue(updateTaskNotifierState);

  const activeProject = useMemo(() => {
    return allProjects.find((proj) => proj.id === projectId);
  }, [allProjects, projectId]);

  const pageTitle = useMemo(
    () =>
      activeProject ? activeProject.name + " | Kanban" : "Kanban | ProMap",
    [activeProject]
  );

  useEffect(() => {
    if (allProjects.length === 0) {
      apiService.get("/api/project").then((res) => {
        setAllProjects(res.data);
      });
    }
  }, []);

  useEffect(() => {
    apiService.get("/api/plan", { projectId: projectId }).then((res) => {
      setAllPlans(res.data);
    });
  }, [projectId]);

  useEffect(() => {
    apiService
      .get("/api/task", {
        projectId: projectId,
        plans: JSON.stringify(filteredPlans),
      })
      .then((res) => {
        setTasksInBoard(res.data);
      });
  }, [projectId, filteredPlans, updateTaskNotifier]);

  const updateTaskStatusInRecoil = (taskKey, newStatus) => {
    let newTasks = [...tasksInBoard];
    const taskIndex = newTasks.findIndex((task) => task.key === taskKey);
    const task = { ...newTasks[taskIndex], status: newStatus };
    newTasks[taskIndex] = task;
    setTasksInBoard(newTasks);
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Box className={classes.root}>
        <Typography component="h4" variant="h4">
          {activeProject?.name} - Kanban Board
        </Typography>
        <Box component="main">
          <Box className="plans-filter">
            <Autocomplete
              multiple
              limitTags={3}
              options={allPlans}
              getOptionLabel={(plan) => plan.name}
              placeholder="All Selected"
              renderInput={(params) => <TextField {...params} label="Plans" />}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                    checkedIcon={<CheckBoxIcon fontSize="small" />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  <Box
                    component="span"
                    sx={{
                      width: 14,
                      height: 14,
                      flexShrink: 0,
                      borderRadius: "3px",
                      mr: 1,
                      mt: "2px",
                    }}
                    style={{ backgroundColor: option.color }}
                  />
                  {option.name}
                </li>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    className="option-chip"
                    deleteIcon={null}
                    sx={{ backgroundColor: option.color }}
                    label={option.name}
                  />
                ))
              }
              sx={{ width: "600px", padding: "8px" }}
              onChange={(e, v) => setFilteredPlans(v.map((i) => i.id))}
            />
          </Box>
          {Boolean(activeProject) && (
            <KanbanBoard
              project={activeProject}
              tasks={tasksInBoard}
              updateStatusInRecoil={updateTaskStatusInRecoil}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

KanbanScreen.layoutWrapper = (page) => <Layout>{page}</Layout>;

export default KanbanScreen;
