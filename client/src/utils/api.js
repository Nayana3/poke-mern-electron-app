import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // search -> /api/pokemon/search?name=..., details -> /api/pokemon/details/:id
  timeout: 10000,
});

export default api;
