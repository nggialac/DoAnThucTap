import InstanceApi from "./InstanceApi";

export function getListOrder() {
  return InstanceApi.get(`donhang`);
}

export function postOrder(manhathuoc: string, params) {
  return InstanceApi.post(`donhang/${manhathuoc}`, params);
}

export function getListOrderByClient(manhathuoc: string) {
  return InstanceApi.get(`donhang/${manhathuoc}`);
}

export function getListOrderByMaDH(madh: string) {
  return InstanceApi.get(`donhang/manhathuoc/${madh}`);
}

export function deleteOrderById(madh: string) {
  return InstanceApi.delete(`donhang/${madh}`);
}

export function cancelOrder(madh: string) {
  return InstanceApi.put(`donhang/${madh}`);
}

export function putOrder(params: object) {
  return InstanceApi.put(`donhang`, params);
}
