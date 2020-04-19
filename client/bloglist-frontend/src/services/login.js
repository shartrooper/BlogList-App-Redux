import axios from 'axios';

const baseUrl = '/api/login';

const login = async (credentials, cancelToken) => {
  const response = await axios.post(baseUrl, credentials, cancelToken);
  return response.data;
};

export default { login };
