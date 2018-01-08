import * as QueryHelper from '../web/helpers/query-helper'

import _ from 'lodash';

var expect = require('chai').expect;
var debug = require('debug')

let queryData = {"state":"GA","min_discharges":"878","max_discharges":"10000009","zip_code":"31703",
                   "name":"SAINT JOHN'S HEALTH CENTER","city":"Albany",
                   "hospital_referral_region_description":"GA - Albany",
                   "min_average_covered_charges":"0", "max_average_covered_charges":"9000009",
                   "min_average_medicare_payments":"90","max_average_medicare_payments":"10928212"
                 };
let parseQueryResponse = ["state = 'GA'","total_discharges BETWEEN 878 AND 10000009","zip_code = '31703'",
                     "name = 'SAINT JOHN''S HEALTH CENTER'","city = 'ALBANY'",
                     "hospital_referral_region_description = 'GA - ALBANY'",
                     "average_covered_charges BETWEEN 0 AND 9000009",
                     "average_medicare_payments BETWEEN 90 AND 10928212"];
let queryFakeData = {"state":"Zz","min_discharges":"fake","max_discharges":"10000009","zip_code":"00000"};
let queryMalformedResponse = "Malformed request. Error retrieving data from database.";
let createSqlQueryResponse = " WHERE GA AND 878 AND 10000009 AND 31703 AND SAINT JOHN'S HEALTH CENTER AND Albany AND GA - Albany AND 0 AND 9000009 AND 90 AND 10928212"


describe("hpc:query-helper-test: ", () => {

  it("validates that query string can be parsed", () => {
    expect(QueryHelper.parseQueryString(queryData)).to.deep.equal(parseQueryResponse)
    expect(QueryHelper.parseQueryString(queryFakeData)).to.equal(queryMalformedResponse)
  });

  it("validates that WHERE clause is properly constructed", () => {
    expect(QueryHelper.createSqlQuery(queryData)).to.equal(createSqlQueryResponse)
  });

});
