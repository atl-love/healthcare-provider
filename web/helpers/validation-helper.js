import _ from 'lodash'

const VALID_STATE_LIST = ["AK","AL","AR","AZ","CA","CO","CT","DC","DE",
                          "FL","GA","GU","HI","IA","ID", "IL","IN","KS","KY",
                          "LA","MA","MD","ME","MH","MI","MN","MO","MS","MT",
                          "NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK",
                          "OR","PA","PR","PW","RI","SC","SD","TN","TX","UT",
                          "VA","VI","VT","WA","WI","WV","WY"];


/**
 * Checks that state abbreviation is valid, case insensitive
 * @param providerState
 * @returns boolean
 */
function isValidProviderState(providerState) {
  return _.includes(VALID_STATE_LIST,providerState);
}

/**
 * Checks that zip code is within range 00501-99950
 * @param zipcode
 * @returns boolean
 */
function isValidZipCode(zipcode) {
  return Number(zipcode) >= 501 && Number(zipcode) <= 99950;
}

/**
 * Checks that data inputs are valid by checking ranges for max/min values, zip code,
 * state, and id.
 * @param propName field to be checked (i.e. state, id, etc)
 * @param data Array that contains data[propName] to be validated
 * @returns boolean
 */
export function isValidDataInput(propName, data){

  let isValid = true;
  let value = data[propName];

    /*if value = min[max]Discharges || min[max]CoveredCharges || min[max]MedicarePayments
      then check if minValue < maxValue*/
    if (propName === 'min_discharges' || propName === 'max_discharges' ||
        propName === 'min_average_covered_charges' || propName === 'max_average_covered_charges' ||
        propName === 'min_average_medicare_payments' || propName === 'min_average_medicare_payments') {

      let minValue = data.hasOwnProperty('min'+propName.substring(3))
                     ? Number(data['min'+propName.substring(3)]) : Number.MIN_SAFE_INTEGER;
      let maxValue = data.hasOwnProperty('max'+propName.substring(3))
                    ? Number(data['max'+propName.substring(3)]) : Number.MAX_SAFE_INTEGER;

      //if data not in range or numeric, return false
      //NOTE: Using '&' instead of '&&' so entire expression will be checked
      if (maxValue < minValue | !_.isFinite(minValue) | !_.isFinite(maxValue)){
        isValid = false;
        console.debug("Error for " + propName + ", minValue > maxValue or non-numeric input entered.");
      }
    }

    //validate zipcode
    if (propName === 'zip_code' & !isValidZipCode(value)){
      isValid = false;
      console.debug("Error for " + propName + ", not within valid zip code range (501-99950).");
    }

    //validate provider id
    if (propName === 'id' & (Number(value) < 0 || _.isNaN(Number(value)))){
      isValid = false;
      console.debug("Error for " + propName + ", value is non-numeric or less than 0.");
    }

    //validate state
    if (propName === 'state' & !isValidProviderState(_.toUpper(value))){
      isValid = false;
      console.debug("Error for " + propName + ", " + value + " is not a US state." );
    }

  return isValid;
}
