import axios from 'axios';
export const apiMiddleware = config => {
  return axios(config)
    .then(async response => {
      const {data, status} = response;
      if (status === 200) {
        return Promise.resolve(data);
      } else {
        return Promise.reject(new Error('Server Error!'));
      }
    })
    .catch(err => {
      console.log('err', err);
      return Promise.reject(new Error(err));
    });
};

export const checkTokenExpiration = token => {
  if (token) {
    const decodedToken = decode(token); // Decoding JWT token (use a library like jwt-decode)
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (decodedToken.exp < currentTime) {
      // refreshToken(); // Function to refresh token if supported by backend
    } else {
      // Token is still valid, continue with the app flow
      // Maybe set a timeout to check again before expiration
    }
  }
};
