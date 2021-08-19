import axios from "axios";


const InstanceApi = axios.create({
  baseURL: "http://192.168.1.6:8080/",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, content-type, application/json, XMLHttpRequest",
  },
});

export default InstanceApi;


