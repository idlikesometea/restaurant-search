const express = require('express');

const fs = require('fs');
const path = require('path');

const filePath = (name, format) => path.join(path.dirname(process.mainModule.filename),
    'files',
    name + '.' + format
);

exports.json = (req, res, next) => {
  const tourData = req.body.tour;
  const timestamp = Date.now();
  const path = filePath(timestamp, 'json');
  fs.writeFile(path, tourData, err => {
    if (err) {
      res.status(500).json({
        success: false,
        file: err
      });
    } else {
      res.download(path, err => {
        if (err) {
          res.status(500).json({
            success: false,
            file: err
          });
        }
      });
    }
  });
};

