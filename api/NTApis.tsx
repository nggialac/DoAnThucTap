import InstanceApi from "./InstanceApi";

export function getNtByUsername(username: string) {
    return InstanceApi.get(`nhathuoc/${username}`);
}