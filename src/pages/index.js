import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import Layout from "../theme/layout";
import apiService from "../services/apiService";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  activeProjectIdState,
  allProjectsState,
  allUsersState,
} from "../recoil/atoms";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      paddingBlock: theme.spacing(4),
      paddingInline: theme.spacing(12),
      "& main": {
        paddingBlock: theme.spacing(4),
        display: "flex",
        flexWrap: "wrap",
        gap: theme.spacing(2),
        "& .project-card": {
          maxWidth: "500px",
          minWidth: "300px",
          boxShadow: "0 1px 8px rgba(0,0,0,.25)",
          cursor: "pointer",
        },
      },
    },
  })
);

const Landing = () => {
  const classes = useStyles();

  const router = useRouter();

  const [projects, setProjects] = useRecoilState(allProjectsState);
  const [activeProjectId, setActiveProjectId] =
    useRecoilState(activeProjectIdState);
  const allUsers = useRecoilValue(allUsersState);

  const leadUserName = useMemo(() => {
    return projects.map(
      (proj) => allUsers.find((user) => user.id === proj.lead)?.username
    );
  }, [projects]);

  useEffect(() => {
    apiService.get("/api/project").then((res) => {
      setProjects(res.data);
    });
  }, []);

  const gotoKanban = (projectId) => {
    localStorage.setItem("currentProject", projectId);
    setActiveProjectId(projectId);
    router.push(`/kanban/${projectId}`);
  };

  return (
    <>
      <Head>
        <title>Projects | ProMap</title>
      </Head>
      <Box className={classes.root}>
        <Typography component="h3" variant="h3">
          Projects
        </Typography>
        <Box component="main">
          {projects.map((project, i) => (
            <Card
              key={project.id}
              className="project-card"
              onClick={() => gotoKanban(project.id)}
            >
              <CardContent>
                <Typography variant="h6">{project.name}</Typography>
                <Typography variant="subtitle2">Tag: {project.tag}</Typography>
                <Typography variant="caption">
                  Lead: {leadUserName[i]}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
};

Landing.layoutWrapper = (page) => <Layout>{page}</Layout>;

export default Landing;
