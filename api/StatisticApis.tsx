import InstanceApi from "./InstanceApi";

export function getRevenue(year: number) {
  return InstanceApi.get(`doanhthu/${year}`);
}

export function getRevenueByFromTo(from: string, to: string) {
  console.log(from, to);
  return InstanceApi.get(`doanhthu/${from}/${to}`);
}

export function getDoanhThuByTrangThaiByDate(from: string, to: string) {
  return InstanceApi.get(`doanhthu/trangthai/${from}/${to}`);
}

export function getDoanhThuByTrangThai(nam: number) {
  return InstanceApi.get(`doanhthu/trangthai/${nam}`);
}
