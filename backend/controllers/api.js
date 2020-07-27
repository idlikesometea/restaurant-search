const express = require('express');

const yelpService = require('../services/yelp');

exports.search = (req, res, next) => {
  const params = {
    location: req.query.location,
    radius: req.query.radius,
    limit: 50,
    offset: req.query.offset || 50
  };

  yelpService.search(params)
    .then(response => {
      res.status(200).json({
        success: true,
        data: {...response.data, offset: params.offset}
      })
    })
    .catch(error => {
      res.status(500).json({
        success: false,
        message: error
      })
    });
};
