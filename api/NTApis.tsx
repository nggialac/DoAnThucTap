import InstanceApi from "./InstanceApi";

export function getNtByUsername(username: string) {
    return InstanceApi.get(`nhathuoc/${username}`);
}

export function putNTInfo(params: object) {
    return InstanceApi.put(`nhathuoc`, params)
}