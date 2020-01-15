import axios from 'axios';
import { enderecoAPI } from '../assets/ip';

const api = axios.create({
   baseURL: enderecoAPI,
});

export default api;