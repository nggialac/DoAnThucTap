import InstanceApi from "./InstanceApi";

export function postLogin(data: {password: string, username: string}) {
  return InstanceApi.post("login", data);
}

export function postRegisterStaff(data){
  return InstanceApi.post("nhanvien", data);
}

export function postRegisterNT(data) {
  return InstanceApi.post("register", data);
}

// export function postLogin(data: {password: string, username: string}) {
//   return InstanceApi.post("login", data);
// } 