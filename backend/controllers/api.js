const express = require('express');

const yelpService = require('../services/yelp');

exports.test = (req, res, next) => {
  res.status(201).json({
    success: true,
    message: 'Exito'
  });
};

exports.search = (req, res, next) => {
  const params = {
    location: req.query.location,
    radius: req.query.radius
  };
  yelpService.search(params)
    .then(response => {
      res.status(200).json({
        success: true,
        message: response.data
      });
    })
    .catch(error => {
      res.status(500).json({
        success: false,
        message: error
      });
    });
};
