// apiConfig.js
// Toggle this to true for production (Render), or false for local development
const isProduction = true; 

const API_BASE_URL = isProduction 
  ? "https://mentorin-backend.onrender.com" 
  : "http://127.0.0.1:5000";

export default API_BASE_URL;
