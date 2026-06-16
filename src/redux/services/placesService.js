import axios from 'axios';

// Your API Base URL (change to your computer's IP for physical device)
const API_BASE_URL = 'http://localhost:3000/places';
// For physical device, use: http://192.168.x.x:3000 (your computer's IP)

export const placeService = {
  // GET all places
  getPlaces: () => axios.get(`${API_BASE_URL}/places`),
  
  // GET single place by ID
  getPlaceById: (id) => axios.get(`${API_BASE_URL}/places/${id}`),
};