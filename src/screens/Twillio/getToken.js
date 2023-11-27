import axios from 'axios';
import {useSelector} from 'react-redux';
// const getToken = async username => {
//   return fetch(
//     `https://9ktgqcno0j.execute-api.ap-south-1.amazonaws.com/chatToken?identity=${username}`,
//   )
//     .then(async response => {
//       const token = await response.json();
//       console.log('accessToken', token.accessToken);
//       return token?.accessToken;
//     })
//     .catch(err => {
//       showMessage({message: err.message, type: 'danger'});
//     });
//     // return axios
//     //   .get(
//     //     `https://9ktgqcno0j.execute-api.ap-south-1.amazonaws.com/chatToken?identity=${username}`,
//     //   )
//     //   .then(twilioUser => twilioUser.data.jwt);
// };

const getToken = async (username,jwtToken) => {
console.log("jwtToken",jwtToken)
  var config = {
    method: 'get',
    url: `https://9ktgqcno0j.execute-api.ap-south-1.amazonaws.com/chatToken?identity=${username}`,
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    },
  };
  try {
    const {data, status} = (await axios(config)) || {};
    if (status === 200) {
      return Promise.resolve(data.accessToken);
    } else {
      return Promise.reject(new Error('Server Error!'));
    }
  } catch (err) {
    console.log('err', err);
    return Promise.reject(new Error(err));
  }
};
// }

export {getToken};
