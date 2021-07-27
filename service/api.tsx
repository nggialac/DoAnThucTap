import api from './config';

const getLogin = (data: string) => {
    return api.post("user", data);
}

export default {
    getLogin,
};
