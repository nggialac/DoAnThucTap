import InstanceApi from "./InstanceApi"

export function getRatingsByProduct(masp: string) {
    return InstanceApi.get(`danhgia/${masp}`);
}

export function getRatingOfNT(mant:string, masp: string) {
    return InstanceApi.get(`danhgia/${mant}/${masp}`);
}

export function postRating(params: object) {
    return InstanceApi.post(`danhgia`, params);
}

export function getListComment() {
    return InstanceApi.get("binhluan");
}

export function getListCommentOfProduct(masp: string) {
    return InstanceApi.get(`binhluan/${masp}`);
}

export function postComment(params: object) {
    return InstanceApi.post("binhluan", params);
}

export function putComment(params: object) {
    return InstanceApi.put("binhluan", params);
}

export function deleteComment(id: number) {
    return InstanceApi.delete("binhluan", {params: { id }});
}