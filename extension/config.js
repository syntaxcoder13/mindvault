/* 
  MINDVAULT MASTER CONFIG 
  Update these URLs ONCE after you host your backend and frontend.
*/

const CONFIG = {
  // 🟢 CURRENT MODE: Change this to 'PROD' when you host it!
  MODE: 'LOCAL', 

  LOCAL: {
    API_URL: 'http://localhost:3001/api',
    AUTH_DOMAIN: 'localhost'
  },

  PROD: {
    // 🔵 PUT YOUR HOSTED URLS HERE ONCE YOU HAVE THEM
    API_URL: 'https://mindvault-api.yourhost.com/api', 
    AUTH_DOMAIN: 'mindvault.vercel.app' 
  }
};

// Helper function to get current config
function getCurrentConfig() {
  return CONFIG[CONFIG.MODE];
}
