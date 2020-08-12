const express = require('express');

const fs = require('fs');
const path = require('path');

const filePath = (name, format) => path.join(path.dirname(process.mainModule.filename),
    'files',
    name + '.' + format
);

exports.json = (req, res) => {
  const tourData = req.body.tour;
  const path = filePath('test', 'json');
  fs.writeFile(path, tourData, err => {
    res.download(path);
  });
};

