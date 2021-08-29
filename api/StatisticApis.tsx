import InstanceApi from "./InstanceApi";

export function getRevenue(year: number) {
    return InstanceApi.get(`doanhthu/${year}`);
}

export function getRevenueByFromTo(from: string, to: string) {
    console.log(from, to);
    return InstanceApi.get(`doanhthu/${from}/${to}`);
}