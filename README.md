# Design and Deploy a RESTful API for a Healthcare Provider

## Overview + Architecture
Nodejs + postgresql + Lodash/ES6 + Mocha/Chai
**Add Diagrams**

### Assumptions
1. For the query string, the assumption is that an array of values will not be received. For example, this case will not be handled:
GET /providers?state=CA&state=GA&state=KY
2. In a production environment, there are special considerations, such as visibility and security, which were not heavily considered in this iteration.
3. Assuming that the user is entering valid data. There is some input validation, but not extensive.
4. Invalid SQL queries will result in a message to the user that says, "Malformed request. Error retrieving data from database."
5. Depending on the browser, for large responses the browser may crash. A design consideration to improve this would be to do "lazy-loading" or use a tool/framework to load part of the data at a time (i.e. AJAX, react-list, retrieve only first 500 sql queries, etc).

### Prerequisites
pgfutter
postgres
Node.js
ES6/Babel
Lodash

### Installation and Deployment
To deploy locally:
  * Populate the DB by using the dump file located in the scripts/ folder:

  ```
   $ psql dbname < providersDump
  ```

  * Run ```$ npm install```
  * Navigate to [http://localhost:5000/](http://localhost:5000/)

  View live demo on [Heroku](https://serene-hamlet-17162.herokuapp.com/).

## API Reference
Time provided and with more REST endpoints, I'd use Swagger for documentation. Below are
all the query params that can be searched:

Parameter | Description
--------- | -----------
id | The id of the provider
name | The name of the provider
street_address | The street address of the provider
city | The city of the provider
state | The state of the provider
zip_code | The zip code of the provider
max_discharges	| Max number of Total Discharges
min_discharges	| Min number of Total Discharges
max_average_covered_charges	| Max Average Covered Charges
min_average_covered_charges	| Min Average Covered Charges
max_average_medicare_payments	| Max Average Medicare Payment
min_average_medicare_payments	| Min Average Medicare Payment
drg_definition | The drg definition of the provider
hospital_referral_region_description | The hospital referral region description of the provider

Example:

```
GET /providers?max_discharges=50&min_discharges=609875&max_average_covered_charges=500
&min_average_covered_charges=40000&min_average_medicare_payments=6000
&max_average_medicare_payments=10000&state=GA
```

## Automated Tests
A selection of automated tests were perfored using Mocha + Chai for the helper functions and Postman + Newman for testing the API. To run Mocha/Chai tests, from the parent directory enter the following:

```$ ./node_modules/.bin/mocha --require babel-core/register test/
```

Sample Output:
![Chai+Mocha Screenshot](/public/views/images/Chai_Mocha_Screenshot.jpg "Chai Mocha Screenshot")

For running Postman/Newman tests enter:

```$ newman run collections/HealthcareProviderAPI.postman_collection.json -e collections/HealthcareProviderEnvironment.postman_environment.json
```

Sample Output:
![Postman+Newman Screenshot](/public/views/images/Postman_Newman_Screenshot.jpg "Postman+Newman Screenshot")

##Postman
The Postman collection and environment variables are located in the collections/ folder. In PostMan, you can see the tests under the 'Test' tab for Total Discharges, Average Covered Payments, and Average Medicare Payments. Select examples are also viewable for certain REST endpoints.

## Tools
* Node.js
* express-generator
* pg-promise
* postgresql
* bluebird
* Postman
* Newman
* Chai
* Mocha
* lodash
* numeral

## License
"Unlicense"
