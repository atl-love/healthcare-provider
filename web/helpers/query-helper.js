/**
 * Description: Functions for correctly parsing and creating SQL queries
 *
 * @author Ashley Love
 **/

 import _ from 'lodash'

 import * as ObjectUtils from './validation-helper' //validates inputs


/**
 * Modifies single quote to double quotes so SQL queries with special chars
 * can be retrieved
 * @param value string
 * @returns string
 * @example
 *  addSingleQuote("St. John's Hospital")
 *    // "St. John''s Hostpital"
 */
function addSingleQuote(value){
  return value.replace(/'/g, "''");
}

/**
 * Iterates through array that contains WHERE clauses, and
 * combines them to form the complete conditional statement.
 * @param query
 * @returns string "WHERE [condition1, ..., conditionN]"
 * @example
 *  createSqlQuery({"state":"GA","min_discharges":"878","max_discharges":"10000009"})
 *    // "WHERE state='GA' AND total_discharges BETWEEN 878 AND 10000009"
 */
 export function createSqlQuery(query){

  let temp = ' WHERE ';
  for ( let i in query) {
        temp += query[i] +' AND ';
  }

 return temp.substring(0,temp.length-5);//substring to remove last AND
}

/** Takes req.query and creates an array of WHERE statements.
 * @param data req.query
   @returns {Array} Valid WHERE clause of SQL queries or an error message if query is malformed

   NOTE: If the SQL table or data set changes to include more
   queries used for data ranges, this function will need to be changed to include
   those new parameters.
*/
export function parseQueryString(data){

  /* Array to hold all WHERE clause conditions for SQL expression */
  let sqlExpression = [];

  //based on query params (data), construct conditional portion of WHERE clause
  for (let propName in data) {

    //if data input is invalid, return Error message instead of sql query
    if(!ObjectUtils.isValidDataInput(propName, data)){
      sqlExpression = "Malformed request. Error retrieving data from database.";
      break;
    }

    /*if value = min[max]Discharges || min[max]CoveredCharges || min[max]MedicarePayments
      then structure query to look for range (i.e. param BETWEEN x AND y)*/
    if (propName === 'min_discharges' || propName === 'max_discharges' ||
        propName === 'min_average_covered_charges' || propName === 'max_average_covered_charges' ||
        propName === 'min_average_medicare_payments' || propName === 'max_average_medicare_payments') {

      let minValue = data.hasOwnProperty('min'+propName.substring(3))
                    ? data['min'+propName.substring(3)] : Number.MIN_SAFE_INTEGER;
      let maxValue = data.hasOwnProperty('max'+propName.substring(3))
                    ? data['max'+propName.substring(3)] : Number.MAX_SAFE_INTEGER;
      let chargeType = propName.includes('discharges') ? 'total_discharges'
                    : propName.includes('covered') ? 'average_covered_charges'
                    : 'average_medicare_payments';
      let rangeQuery = chargeType + " BETWEEN " + minValue + " AND " + maxValue

      //push to sqlExpression if rangeQuery is unique
      if (!_.includes(sqlExpression, rangeQuery)) {
        sqlExpression.push(rangeQuery);
      }

    } else {//handle queries without range where propName = value (i.e. state = 'FL')

      sqlExpression.push( propName + " = '" + addSingleQuote(data[propName].toUpperCase()) + "'");

    }

  }

  return sqlExpression;

}
