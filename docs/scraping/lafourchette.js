// API La Fourchette https://m.lafourchette.com/api/restaurant-prediction?name=Auberge du Cheval

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

const configuration ={
	'uri':'https://www.lafourchette.com'
	'headers':{
		'cookies':'';
	}
}

request(configuration, (err,response)=>{

});



