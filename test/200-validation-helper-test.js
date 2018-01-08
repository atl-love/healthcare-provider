import * as ValidationHelper from '../web/helpers/validation-helper'

import _ from 'lodash';

var expect = require('chai').expect;
var debug = require('debug')

describe("hpc:validation-helper-test: ", () => {

  it("validates that data enteres is valid US state", () => {
    expect(ValidationHelper.isValidDataInput('state',{"state":"CA"})).to.be.true
    expect(ValidationHelper.isValidDataInput('state',{"state":"ga"})).to.be.true
    expect(ValidationHelper.isValidDataInput('state',{"state":"Ze"})).to.be.false
  });

  it("validates that zip code is valid", () => {
    expect(ValidationHelper.isValidDataInput('zip_code', {"zip_code":"94601"})).to.be.true
    expect(ValidationHelper.isValidDataInput('zip_code', {"zip_code":94601})).to.be.true
    expect(ValidationHelper.isValidDataInput('zip_code', {"zip_code":"00501"})).to.be.true
    expect(ValidationHelper.isValidDataInput('zip_code', {"zip_code":"99950"})).to.be.true
    expect(ValidationHelper.isValidDataInput('zip_code', {"zip_code":"99999"})).to.be.false
    expect(ValidationHelper.isValidDataInput('zip_code', {"zip_code":"fakeZip"})).to.be.false
  });

  it("validates that ID is numeric", () => {
    expect(ValidationHelper.isValidDataInput('id', {"id":"908786"})).to.be.true
    expect(ValidationHelper.isValidDataInput('id', {"id":"0"})).to.be.true
    expect(ValidationHelper.isValidDataInput('id', {"id":"-908786"})).to.be.false
    expect(ValidationHelper.isValidDataInput('id', {"id":"fakeId"})).to.be.false
  });

  it("validates that range values are valid", () => {
    expect(ValidationHelper.isValidDataInput('min_discharges', {"min_discharges":"878","max_discharges":"10000009"})).to.be.true
    expect(ValidationHelper.isValidDataInput('min_discharges', {"min_discharges":"878","max_discharges":"0"})).to.be.false
    expect(ValidationHelper.isValidDataInput('min_discharges', {"min_discharges":"878","max_discharges":"fakeData"})).to.be.false
  })

});
