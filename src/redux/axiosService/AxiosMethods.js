import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const postMethod = ({url, method, string, token}) => {
  createAsyncThunk(string, async data => {
    const config = {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      url: url,
      data: data,
    };
    return axios(config)
      .then(async result => {
        let data = result.data;

        const {response = {}, status} = result || {};
        if (status === 200) {
          return Promise.resolve({data, formInput});
        } else if (status === 401) {
          return Promise.reject(INVALID_CREDENTIAL);
        } else {
          return Promise.reject(result.response);
          // return Promise.reject(data);
        }
      })
      .catch(err => {
        return Promise.reject(err?.response);
      });
  });
};

const getMethod = ({url, method, string, token}) => {
  createAsyncThunk(string, async () => {
    const config = {
      method: method,
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    return axios(config)
      .then(response => {
        const {data, status} = response;
        if (status === 200) {
          return Promise.resolve(data);
        }
      })
      .catch(err => {
        let statusCode = 500;
        if (err?.response) {
          statusCode = err?.response.status;
        }
        if (statusCode === 401) {
          return Promise.reject(err?.response?.data?.message);
        } else {
          return Promise.reject(new Error(err));
        }
      });
  });
};

export {postMethod, getMethod};
