import InstanceApi from "./InstanceApi";

export function getListNV() {
  return InstanceApi.get("nhanvien");
}

// 
export function getListNT() {
  return InstanceApi.get("nhathuoc");
}

export function putNT(params: object) {
  return InstanceApi.put("nhathuoc", params);
}

export function deleteNT(matk: string) {
  return InstanceApi.delete(`nhathuoc/${matk}`);
}