import InstanceApi from "./InstanceApi";

export function getListMedicine() {
  return InstanceApi.get("sanpham");
}

export function getListMedicineSearch(tensp: string) {
  return InstanceApi.get("sanpham/search", {params: {tensp: tensp}});
}

export function postMedicine(params: object) {
  return InstanceApi.post("sanpham", params);
}

export function putMedicine(params: object) {
  return InstanceApi.put("sanpham", params);
}

export function deleteMedicine(id) {
  return InstanceApi.delete(`sanpham/${id}`);
}

export function getMedicineByCategory(id) {
  return InstanceApi.get(`sanpham/danhmuc/${id}`);
}

//CATEGORY
export function postCategoryMedicine(param: object) {
  return InstanceApi.post("danhmuc", param);
}

export function putCategoryMedicine(param) {
  return InstanceApi.put("danhmuc", param);
}

export function deleteCategoryMedicine(id) {
  return InstanceApi.delete(`danhmuc/${id}`);
}

export function getListCategoryMedicine() {
  return InstanceApi.get("danhmuc");
}

export function getLastCategoryMedicine() {
  return InstanceApi.get("danhmuc/last");
}
