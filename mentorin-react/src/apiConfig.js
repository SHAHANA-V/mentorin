// apiConfig.js
// Toggle this to true for production (Render), or false for local development
const isProduction = false; 

const API_BASE_URL = isProduction 
  ? "https://mentorin-backend.onrender.com" 
  : "http://localhost:5000";

export default API_BASE_URL;
