import InstanceApi from "./InstanceApi";

export function postLogin(data: {password: string, username: string}) {
  return InstanceApi.post("login", data);
}
