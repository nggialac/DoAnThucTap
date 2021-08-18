import InstanceApi from "./InstanceApi";

export function getListStaff(){
    return InstanceApi.get('nhanvien');
} 
export function postStaff(param){
    return InstanceApi.post('nhanvien', param);
} 
export function putStaff(param){
    return InstanceApi.put('nhanvien', param);
} 
export function deleteStaff(id){
    return InstanceApi.delete(`nhanvien/${id}`);
} 

export function getStaffByUsername(username: string) {
    return InstanceApi.get(`nhanvien/${username}`);
}