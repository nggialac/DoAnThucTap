import InstanceApi from "./InstanceApi";

export function getListCart(manhathuoc: string) {
  return InstanceApi.get(`giohang/${manhathuoc}`);
}

export function getNumberListCart(manhathuoc: string) {
  return InstanceApi.get(`giohang/${manhathuoc}`);
}

export function postCart(manhathuoc: string, masp: string, soluong: number) {
  return InstanceApi.post(`giohang/${manhathuoc}/${masp}`, null, {
    params: { soluong: soluong },
  });
}

export function deleteCartByNT(manhathuoc: string) {
  return InstanceApi.delete(`giohang/${manhathuoc}`);
}

export function deleteCartByMedicineId(manhathuoc: string, masp: string) {
  return InstanceApi.delete(`giohang/${manhathuoc}/${masp}`);
}
