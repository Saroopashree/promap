import axios from "axios";
import Router from "next/router";
import { setRecoil } from "recoil-nexus";
import {
  allUsersState,
  sessionTokenState,
  allProjectsState,
  activeProjectState,
  tasksInKanbanState,
} from "../recoil/atoms";
import { getSessionToken } from "./lsService";

export const clearAppContents = () => {
  // Clear all items stored in localStorage
  localStorage.removeItem("currentUser");
  localStorage.removeItem("currentProject");

  // Clear all recoil states
  setRecoil(allUsersState, []);
  setRecoil(sessionTokenState, null);
  setRecoil(allProjectsState, []);
  setRecoil(activeProjectState, null);
  setRecoil(tasksInKanbanState, []);

  Router.push("/signin");
};

export const apiGet = (url, params) => {
  const urlParams = new URLSearchParams(params).toString();
  const token = getSessionToken();
  return new Promise((resolve, reject) =>
    axios
      .get(url + urlParams, { headers: { authorization: `Bearer ${token}` } })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          clearAppContents();
        }
        reject(err);
      })
  );
};

export const apiPost = (url, data, params) => {
  const urlParams = new URLSearchParams(params).toString();
  const token = getSessionToken();
  return new Promise((resolve, reject) =>
    axios
      .post(url + urlParams, data, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          clearAppContents();
        }
        reject(err);
      })
  );
};

export const apiPut = (url, data, params) => {
  const urlParams = new URLSearchParams(params).toString();
  const token = getSessionToken();
  return new Promise((resolve, reject) =>
    axios
      .put(url + urlParams, data, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          clearAppContents();
        }
        reject(err);
      })
  );
};

export const apiDelete = (url, params) => {
  const urlParams = new URLSearchParams(params).toString();
  const token = getSessionToken();
  return new Promise((resolve, reject) =>
    axios
      .delete(url + urlParams, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          clearAppContents();
        }
        reject(err);
      })
  );
};

const apiService = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
};

export default apiService;
