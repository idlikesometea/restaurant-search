const express = require('express');

const axios = require('axios');

const config = {
  headers: {
    Authorization: 'Bearer ' + process.env.YELP_API_KEY
  }
}

const API_URL = 'https://api.yelp.com/v3';

exports.search = (params) => axios.get(`${API_URL}/businesses/search`, {...config, params: params});
