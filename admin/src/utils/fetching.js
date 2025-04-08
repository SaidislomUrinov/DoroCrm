import axios from "axios";

export const API = `http://localhost:5000`;

export const getReq = (pref = '', params = {}) => {
    return axios(`${API}/api${pref}`, {
        headers: {
            'x-auth-token': `Bearer ${sessionStorage?.access}`
        },
        params
    });
}
export const postReq = (pref = '', data = {}) => {
    return axios.post(`${API}/api${pref}`, data, {
        headers: {
            'x-auth-token': `Bearer ${sessionStorage?.access}`
        },
    });
}
export const putReq = (pref = '', data = {}) => {
    return axios.put(`${API}/api${pref}`, data, {
        headers: {
            'x-auth-token': `Bearer ${sessionStorage?.access}`
        },
    });
}
export const delReq = (pref = '', params = {}) => {
    return axios.del(`${API}/api${pref}`, {
        headers: {
            'x-auth-token': `Bearer ${sessionStorage?.access}`
        },
        params
    });
}