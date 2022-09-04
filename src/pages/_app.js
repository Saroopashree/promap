import { ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { RecoilRoot, useRecoilState } from "recoil";

import { theme } from "../theme/theme";

import "../../styles/globals.css";
import { activeProjectIdState, sessionTokenState } from "../recoil/atoms";
import { useEffect } from "react";
import { getActiveProject, getSessionToken } from "../services/lsService";
import RecoilNexus from "recoil-nexus";

function MyApp({ Component, pageProps }) {
  const wrapper = Component.layoutWrapper
    ? Component.layoutWrapper
    : (page) => page;

  return (
    <div style={{ backgroundColor: "#eee", minHeight: "100vh" }}>
      <ThemeProvider theme={theme}>
        <RecoilRoot>
          <SnackbarProvider>
            <RecoilNexus />
            <RecoilInitializer />
            {wrapper(<Component {...pageProps} />)}
          </SnackbarProvider>
        </RecoilRoot>
      </ThemeProvider>
    </div>
  );
}

const RecoilInitializer = () => {
  const [token, setToken] = useRecoilState(sessionTokenState);
  const [activeProject, setActiveProject] =
    useRecoilState(activeProjectIdState);

  useEffect(() => {
    if (localStorage !== undefined) {
      setActiveProject(getActiveProject());
      setToken(getSessionToken());
    }
  }, []);

  return <></>;
};

export default MyApp;
