import _ from 'lodash'

var express = require('express');
var router = express.Router();
var db = require('../api/provider-api');
var favicon = require('serve-favicon');

router.get('/providers', db.getProviders);
router.get('/providers/:id', db.getOneProvider);

//hot fix for favicon 500 error
router.get('/favicon.ico', function(req, res) {
    res.status(204);
});
// application -------------------------------------------------------------
router.get('/', function (req, res) {

    res.render('index', {title: 'healthcare-provider-challenge'});
});



module.exports = router;
