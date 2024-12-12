import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

const get = async (endpoint) => {
    try {
        console.log(`GET request to ${API_BASE_URL}${endpoint}`);
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log("Response data:", typeof response.data);
        return response.data;
    } catch (error) {
        console.error(`GET ${endpoint} failed:`, error);
        throw error;
    }
};

const post = async (endpoint, data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`POST ${endpoint} failed:`, error);
        throw error;
    }
};

export const getGroups = () => get('/groups');
export const getAuthors = (excludeAuthors) => get(`/authors?exclude_authors=${excludeAuthors.join()}`);
export const getGraph = () => get('/graph');
export const getStates = () => get('/states');
export const getGraphState = (state) => get(`/state/${state}`);
export const getData = () => get('/data');
export const getMaxValues = () => get('/max');
export const getCluster = (focusNode) => post('/cluster', focusNode);
export const postFilters = (filters) => post('/filter', filters);
export const buildGraph = (data) => post('/build', data);
export const findShortestPath = (graph, source, target) => post('/path', { graph, source, target });