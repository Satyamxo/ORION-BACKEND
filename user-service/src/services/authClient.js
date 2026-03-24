const axios = require("axios");

const AUTH_BASE_URL = process.env.AUTH_SERVICE_URL;

exports.fetchAuthUsers = async () => {
  const res = await axios.get(`${AUTH_BASE_URL}/internal/users`);
  return res.data; // auth users list
};