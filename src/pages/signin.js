import { useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Button, FormGroup, Tab, Tabs, TextField } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import apiService from "../services/apiService";
import { useRecoilState } from "recoil";
import { channelIdState, sessionTokenState } from "../recoil/atoms";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "grid",
      placeItems: "center",
      height: "100vh",
      width: "100vw",
      "& .container": {
        display: "flex",
        maxWidth: "60vw",
        // width: "700px",
        border: "1px solid #ccc",
        boxShadow: "0 1px 8px rgba(0,0,0,.25)",
        borderRadius: "5px",
        "& .form-wrapper": {
          padding: theme.spacing(2),
          marginLeft: theme.spacing(3),
          "& .input-el": {
            marginBlock: theme.spacing(1),
            width: "300px",
          },
          "& .action-btn": {
            marginBlock: theme.spacing(1),
          },
        },
      },
    },
  })
);

const SignIn = () => {
  const classes = useStyles();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [switchTab, setSwitchTab] = useState(0);

  const [token, setToken] = useRecoilState(sessionTokenState);
  const [channelId, setChannelId] = useRecoilState(channelIdState);

  const pageTitle = useMemo(
    () => (switchTab === 0 ? "Sign In" : "Sign Up"),
    [switchTab]
  );

  const onSignIn = () => {
    apiService.post("/api/user/login", { email, password }).then((res) => {
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      setToken(res.data.token);
      setChannelId(res.data.channelId);
      router.push("/");
    });
  };

  const onSignUp = () => {
    apiService
      .post("/api/user/signup", { email, username, password })
      .then((res) => {
        localStorage.setItem("currentUser", JSON.stringify(res.data));
        setToken(res.data.token);
        setChannelId(res.data.channelId);
        router.push("/");
      });
  };

  return (
    <>
      <Head>
        <title>{pageTitle} | ProMap</title>
      </Head>
      <Box className={classes.root}>
        <Box className="container">
          <Box>
            <Tabs
              orientation="vertical"
              variant="fullwidth"
              centered
              value={switchTab}
              onChange={(e, v) => setSwitchTab(v)}
            >
              <Tab label="Sign In" />
              <Tab label="Sign Up" />
            </Tabs>
          </Box>

          <Box className="form-wrapper">
            <Box>
              {switchTab === 1 ? (
                <FormGroup>
                  <TextField
                    className="input-el"
                    variant="outlined"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    className="input-el"
                    variant="outlined"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <TextField
                    className="input-el"
                    variant="outlined"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    className="action-btn"
                    variant="contained"
                    onClick={onSignUp}
                  >
                    {pageTitle}
                  </Button>
                </FormGroup>
              ) : (
                <FormGroup>
                  <TextField
                    className="input-el"
                    variant="outlined"
                    label="Email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    className="input-el"
                    variant="outlined"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    className="action-btn"
                    variant="contained"
                    onClick={onSignIn}
                  >
                    {pageTitle}
                  </Button>
                </FormGroup>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SignIn;
