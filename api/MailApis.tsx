import InstanceApi from "./InstanceApi";

export function forgetPassword(params: any) {
    return InstanceApi.post("/mail/sendingemail", params);
}