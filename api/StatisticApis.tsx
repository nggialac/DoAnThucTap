import InstanceApi from "./InstanceApi";

export function getRevenue() {
    return InstanceApi.get("doanhthu");
}