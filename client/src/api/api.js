import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.0.113:5000/api",
});

export default API;