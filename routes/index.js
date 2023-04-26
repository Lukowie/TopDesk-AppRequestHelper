var express = require('express');
var router = express.Router();
var https = require('https');

var data = '';

var options = {
  'method': 'GET',
  'headers': {
    'Authorization': 'Basic THVjYXMuVmFuZGVybWFhcmVsQGVkLmFtZHNiLmNhOndhNnF6LTI3Ymo2LXhpb2ptLXJ1N2R0LXV6Ym40'
  }
};
const req = https.request('https://amdsb.topdesk.net/tas/api/incidents?query=category.name==(\'App Approval Request\')', options, (res) => {

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    data = JSON.parse(data);
  });
});

req.end();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TopDesk App Approval Request Helper', tickets: data }); 
});

module.exports = router;
