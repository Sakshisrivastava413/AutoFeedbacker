const express = require('express');
const parallelDots = require('paralleldots');

const router = express.Router();

parallelDots.apiKey = "WtUsmQtjgqu7uiHZM07jPfgUZI1zDTsVsJF1dU0dqb8";

const handlePromise = (promise, res) => {
  promise.then((response) => {
    res.send(response);
    console.log(response);
  }).catch((error) => {
    res.send(error);
    console.log(error);
  });
}

router.post('/analysis', function(req, res) {
  const text = req.body.text;
  console.time();
  Promise.all([
    parallelDots.sentiment(text),
    parallelDots.emotion(text),
    parallelDots.abuse(text),
    parallelDots.keywords(text)
  ]).then((results) => {
    let response = {
      'sentiments': JSON.parse(results[0]),
      'emotion': JSON.parse(results[1]),
      'abuse': JSON.parse(results[2]),
      'keywords': JSON.parse(results[3])
    }
    res.send(response);
    console.timeEnd();
  })
});

router.post('/sentiment', function (req, res) {
  handlePromise(parallelDots.sentiment(req.body.text), res);
});

router.post('/emotion', function (req, res) {
  handlePromise(parallelDots.emotion(req.body.text), res);
});

router.post('/abuse', function (req, res) {
  handlePromise(parallelDots.abuse(req.body.text), res);
});

router.post('/keywords', function (req, res) {
  handlePromise(parallelDots.keywords(req.body.text), res);
});

module.exports = router;
