import axios from "axios";


const InstanceApi = axios.create({
  baseURL: "https://medical-ecom-2021.herokuapp.com/",
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


