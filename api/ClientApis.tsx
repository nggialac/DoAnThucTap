import InstanceApi from "./InstanceApi";

export function getListNV() {
  return InstanceApi.get("nhanvien");
}
