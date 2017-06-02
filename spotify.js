import fetch from 'node-fetch';
import base64 from 'base-64';
import config from './config';

export const authorize = async (code, state) => {
  try {
    const url = 'https://accounts.spotify.com/api/token';
    const auth = `Basic ${base64.encode(`${config.spotify.id}:${config.spotify.secret}`)}`;
    const form = `grant_type=authorization_code&code=${code}&redirect_uri=${state}/auth/spotify`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: auth,
      },
      body: form,
    });

    if (!response.ok) {
      throw {
        message: 'spotify failed to authenticate',
      };
    }

    const data = await response.json();

    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const refresh = async (code) => {
  try {
    const url = 'https://accounts.spotify.com/api/token';
    const auth = `Basic ${base64.encode(`${config.spotify.id}:${config.spotify.secret}`)}`;
    const form = `grant_type=refresh_token&refresh_token=${code}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: auth,
      },
      body: form,
    });

    if (!response.ok) {
      throw {
        message: 'spotify failed to refresh',
      };
    }

    const data = await response.json();

    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};
