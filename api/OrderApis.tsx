import InstanceApi from "./InstanceApi";

export function getListOrder() {
  return InstanceApi.get(`donhang`);
}

export function postOrder(
  manhathuoc: string,
  hinhthucthanhtoan: number,
  body,
  paymentCreated: string
) {
  return InstanceApi.post(`donhang/${manhathuoc}/${hinhthucthanhtoan}`, body, {
    params: { paymentCreated: paymentCreated },
  });
}

export function postOrderCash(
  manhathuoc: string,
  hinhthucthanhtoan: number,
  body
) {
  return InstanceApi.post(`donhang/${manhathuoc}/${hinhthucthanhtoan}`, body);
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

export function cancelOrder(madh: string, manv: string) {
  console.log(madh, manv);
  return InstanceApi.put(`donhang/${madh}`,{}, { params: {
    manv: "NV9999999",
  }});
}

export function putOrder(params: object) {
  return InstanceApi.put(`donhang`, params);
}
