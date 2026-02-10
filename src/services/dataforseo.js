const axios = require('axios');

const BASE_API = 'https://api.dataforseo.com/v3';

function client() {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;

  if (!login || !password) {
    throw new Error('DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD must be set');
  }

  return axios.create({
    baseURL: BASE_API,
    auth: { username: login, password },
    timeout: 30000
  });
}

async function createGoogleOrganicTask({ keyword, locationCode, languageCode, device, os, tag }) {
  const http = client();
  const postbackUrl = `${process.env.BASE_URL}/webhooks/dataforseo/postback`;
  const payload = [
    {
      keyword,
      location_code: locationCode,
      language_code: languageCode,
      device,
      os,
      postback_url: postbackUrl,
      tag
    }
  ];

  const { data } = await http.post('/serp/google/organic/task_post', payload);
  return data;
}

module.exports = { createGoogleOrganicTask };
