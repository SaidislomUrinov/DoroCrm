import axios from "axios";

export const API = 'http://localhost:5000';
export const getReq = (pref = '', params = {}) => {
    return axios.get(`${API}/api${pref}`, {
        headers: {
            'x-auth-token': `Bearer ${localStorage.getItem('access')}`
        },
        params
    });
};

export const postReq = (pref = '', data = {}) => {
    return axios.post(`${API}/api${pref}`, data, {
        headers: {
            'x-auth-token': `Bearer ${localStorage.getItem('access')}`
        }
    });
};

export const putReq = (pref = '', data = {}) => {
    return axios.put(`${API}/api${pref}`, data, {
        headers: {
            'x-auth-token': `Bearer ${localStorage.getItem('access')}`
        }
    });
}

export const delReq = (pref = '', params = {}) => {
    return axios.delete(`${API}/api${pref}`, {
        headers: {
            'x-auth-token': `Bearer ${localStorage.getItem('access')}`
        },
        params
    });
}