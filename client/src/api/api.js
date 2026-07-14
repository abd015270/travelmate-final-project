import axios from "axios";

const API = axios.create({
  baseURL: "http://10.69.0.238:5000/api",
  timeout: 10000,
});

export default API;