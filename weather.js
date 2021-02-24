const { request } = require('http');
const https = require('https');
const http = require('http');
const api = require('./api.json');

//print error message
function printError(text, error) {
    console.error(text, error);
}

//print out func
function printOut(w) {
    try{
    const celsius = Math.floor(w.main.feels_like - 273.15);
    const message = `Current temprature in ${w.name} is ${celsius} celsius`;
    console.log(message);
    } catch(error) {
        console.log(`${w.name} not found`)
    }
    
}


function get(query) {
    const readableQuery = query.replace('_', ' ');
    try {
        const request = https.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${api.key}`,
        response => {
            if(response.statusCode === 200) {
                let body = "";
                //Read data
                response.on('data', concat => {
                    body += concat;
                });
                response.on('end', () => {
                   const w = JSON.parse(body);
                   //print data
                   printOut(w);
                })
            } else {
                const statusError = new Error(`There was an error getting the message for ${readableQuery}.
                (${http.STATUS_CODES[response.statusCode]})`);
                printOut('Error message: ', statusError);
            }
           
        });
        request.on('error', error => printError('Request error: ', error))
    } catch(error) {
        printError('Error message: ', error);
    }
   
}

module.exports.get = get;