import * as QueryUtils from '../helpers/query-helper'

var promise = require('bluebird');
var _ = require('lodash');//manipulate arrays of objects in an easy manner
var numeral = require('numeral');//make numeric values in $YY,YYY.YY format

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/providers';
var db = pgp(connectionString);

/**
* Returns all the providers corresponding to an id.
*
* @param req request object
* @param res response object
* @param next next function in stack
*
*/
function getOneProvider(req, res, next) {
  let providerID = parseInt(req.params.id);
  db.any('select * from providers where id = $1', providerID)
    .then(function (data) {
      res.header("Content-Type", 'application/json');
      res.status(200)
      res.send(JSON.stringify(displayQueryResults(data),null,3));
    })
    .catch(function (err) {
      return next(err);
    });
}

/**
* Determine if a query string is entered and handled accordingly. If /providers
* is entered than all providers will be retrieved, but if a query string is
* entered then return the results of the conditions. Function returns a JSON
* that corresponds to the SQL query.
*
* @param req request object
* @param res response object
* @param next next function in stack
*
*/
function getProviders(req, res, next) {

  let selectAllFromQuery = "SELECT * FROM providers";

  //if there is no query string, default to "Select * from providers", but if
  //query string found, parse string
  let providersFromQuery = Object.keys(req.query).length === 0
                           ?  selectAllFromQuery
                           : findProvidersFromQuery(req.query);

  //display error to user if data couldn't be retrieved from DB
  if(providersFromQuery === "Malformed request. Error retrieving data from database."){
    console.error("Providers from Query => " + providersFromQuery);
    res.header("Content-Type", 'application/json');
    res.status(200)
    res.send(providersFromQuery);

  }
  else { //no errors, display results for query string or all providers
    let sqlQuery = providersFromQuery === selectAllFromQuery ? selectAllFromQuery
              : selectAllFromQuery + providersFromQuery;
    db.any(sqlQuery)
      .then(function (data) {
        res.header("Content-Type", 'application/json');
        res.status(200)
        res.send(_.isEmpty(data) ? "No matches found" : JSON.stringify(displayQueryResults(data),null,3));
      })
      .catch(function (err) {
        return next(err);
      });
  }
}

/**
* Sanitizes/retrieves query params and creates an array of WHERE conditionals
*  or gets error message if data is invalid
* @param {Array} queryString The query string from req.query (i.e. ?=state=CA&zip_code=90210)
* @returns {Array} Returns the where portion of an SQL query (i.e. "WHERE state = 'CA' and zip_code='90210'")
*
*/
function findProvidersFromQuery(queryString) {

  let sanitizedQueryResults = QueryUtils.parseQueryString(queryString);

  if (sanitizedQueryResults === "Malformed request. Error retrieving data from database."){
    return sanitizedQueryResults;
  }

  let sqlQuery =  QueryUtils.createSqlQuery(sanitizedQueryResults);
  console.log('Query parameters: '+ sanitizedQueryResults);
  console.log('Execute query: SELECT * FROM providers '+ sqlQuery);

  return sqlQuery;

}

/**
* Formats query Array of objects into a human-readable format
*
* @param {Array} data The collection of providers to iterate over.
* @returns {Array} Returns array of formatted provider objects.
* @example
*
* displayQueryResults({"name":"TEXAS HEALTH PRESBYTERIAN HOSPITAL FLOWER MOUND",
*                      "street_address":"4400 LONG PRAIRIE ROAD","city":"FLOWER MOUND","state":"TX",
*                      "zip_code":"75028","hospital_referral_region_description":"TX - Dallas",
*                      "total_discharges":670068,"average_covered_charges":"15042.00",
*                      "average_total_payments":"3539.75","average_medicare_payments":"2887.41"}]
*                      // => {"Provider": TEXAS HEALTH PRESBYTERIAN HOSPITAL FLOWER MOUND,
*                      //     "Provider Street Address": "4400 LONG PRAIRIE ROAD",
*                      //     "Provider City": "Flower Mound",
*                      //     ...
*                      //     }
*
*/
function displayQueryResults (data) {
  const providersList =  _.map(data, provider => {
   return {
     "Provider": provider.name,
     "Provider Street Address": provider['street_address'],
     "Provider City": provider.city,
     "Provider State": provider.state,
     "Provider Zip Code": provider['zip_code'],
     "Hospital Referral Region Description": provider['hospital_referral_region_description'],
     "Total Discharges": provider['total_discharges'],
     "Average Covered Charges": numeral(provider['average_covered_charges']).format('$0,0.00'),
     "Average Total Payments": 	numeral(provider['average_total_payments']).format('$0,0.00'),
     "Average Medicare Payments": numeral(provider['average_medicare_payments']).format('$0,0.00')
   }
 })
 return providersList;
}

module.exports = {
  getProviders: getProviders,
  getOneProvider: getOneProvider
};
