import InstanceApi from "./InstanceApi";

export function getRevenue() {
    return InstanceApi.get("doanhthu");
}

export function getRevenueByFromTo(from: string, to: string) {
    console.log(from, to);
    return InstanceApi.get(`doanhthu/${from}/${to}`);
}