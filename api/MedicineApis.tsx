import InstanceApi from "./InstanceApi";

export function getListMedicine() {
  return InstanceApi.get("sanpham");
}

export function postMedicine(params: object){
  return InstanceApi.post('sanpham', params);
}

export function putMedicine(params: object){
  return InstanceApi.put('sanpham', params);
}

export function deleteMedicine(id){
  return InstanceApi.delete(`sanpham/${id}`);
}

export function getMedicineByCategory(id) {
  return InstanceApi.get(`sanpham/danhmuc/${id}`);
}


//Danh muc
export function getListCategoryMedicine() {
  return InstanceApi.get("danhmuc");
}


