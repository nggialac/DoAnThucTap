import axios from "axios";

const rest_url = 'http://localhost:8080/';

export default axios.create({
  baseURL: rest_url,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, content-type, application/json, XMLHttpRequest'
}});

