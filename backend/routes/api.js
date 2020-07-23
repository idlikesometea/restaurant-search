const express = require('express');

const axios = require('axios');

const router = express.Router();

const businessSearch = 'https://api.yelp.com/v3/businesses/search';

router.get('/test', (req, res, next) => {
  res.status(201).json({
    success: true,
    message: 'Exito'
  });
});

router.get('/search', (req, res, next) => {
  const params = {
    location: req.query.location,
    radius: req.query.radius
  };
  const config = {
    headers: {
      Authorization: 'Bearer hp-kfkClFcBxeOaQb_-8UnYGQJt5tg6T2W1wnuoO5fYUKK_8FLR5KSCehS1W9MLXhMDVOcTRWtUlFYCJtTq4K6BxcJo6hA_m6T5ZzHooqmIy75undNKSewlYwvAYX3Yx'
    },
    params: params
  }
  axios.get(businessSearch, config)
  .then(response => {
    res.status(200).json({
      success: true,
      data: response.data
    });
  })
  .catch(err => {
    res.status(500).json({
      success: false,
      error: err
    })
  });
});

module.exports = router;
