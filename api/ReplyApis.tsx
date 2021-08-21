import InstanceApi from "./InstanceApi"

export function getListReply() {
    return InstanceApi.get("phanhoi");
}

export function getListReplyOfComment(mabl: number) {
    return InstanceApi.get(`phanhoi/${mabl}`);
}

export function getListReplyByNhathuoc(manhathuoc: number) {
    return InstanceApi.get(`phanhoi/nt/${manhathuoc}`);
}

export function postReply(params: object) {
    return InstanceApi.post("phanhoi", params);
}

export function putReply(params: object) {
    return InstanceApi.put("phanhoi", params);
}

export function deleteReply(id: number) {
    return InstanceApi.delete(`phanhoi/${id}`);
}