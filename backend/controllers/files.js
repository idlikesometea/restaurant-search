const express = require('express');

const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');
const { time } = require('console');

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
        message: err
      });
    } else {
      res.download(path, err => {
        if (err) {
          res.status(500).json({
            success: false,
            message: err
          });
        }
      });
    }
  });
};

exports.pdf = (req, res, next) => {
  const tourData = JSON.parse(req.body.tour);
  const doc = new PDFDocument;
  const timestamp = Date.now();
  const path = filePath(timestamp, 'pdf');
  const writeStream = fs.createWriteStream(path);
  doc.pipe(writeStream);

  doc.fontSize(25).text('Your tour', 100, 80).moveDown();
  tourData.forEach(business => {
    doc.fontSize(18).text(business.name);
    doc.fontSize(12).text('Location: ' + business.location).moveDown(2);
  })

  doc.end();
  writeStream.on('finish', function () {
    res.download(path, err => {
      if (err) {
        res.status(500).json({
          success: false,
          message: err
        })
      }
      fs.unlinkSync(path);
    });
  });
}

