import axios from "axios";

const rest_url = 'https://medical-ecom-2021.herokuapp.com/';

export default axios.create({
  baseURL: rest_url,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, content-type, application/json, XMLHttpRequest'
}});

