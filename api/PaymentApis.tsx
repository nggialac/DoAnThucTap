import axios from "axios";
import { SecretKey } from "../constants/Stripe";

const InstanceStripe = axios.create({
    baseURL: "http://192.168.1.6:3000/",
    // withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${SecretKey}`,
    },
  });
  

export function postCharge(params: object) {
    return InstanceStripe.post("create-payment-intent", null, params)
}