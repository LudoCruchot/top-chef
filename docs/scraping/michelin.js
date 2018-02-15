// cd /ESILV/annee4/WebApplication/top-chef/docs/scraping

//var express = require('express');
//var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var fs =require('fs');

var url='https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';

var url='https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
var pageMax=0;

function ScrapingPages(){
// scrape les 34 pages des restos
	AmountPages(function(err,results){
		//console.log(err,pageMax);
		console.log("Nombre de pages de restos:",pageMax);

		var i;
		for(i=0;i<2/*pageMax+1*/;i++)
		{
			ScrapingPage(i);
		}


	});
}

function AmountPages(callback){
// calcul le nombre de pages a scraper


	request(url, function(error, response, html){

		if(!error){
			var $ = cheerio.load(html);

			$('li.mr-pager-item').each(function(i,element){

				var data= $(this).text();

				if(parseInt(data)>pageMax)
				{
					pageMax=parseInt(data);
				}

			});
			callback(null,pageMax);
		}
	});
}

function ScrapingPage(pageNumber){
// scrape une page
	var url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
	if(pageNumber>0)
	{
		url='https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin'+'/page-'+pageNumber;
	}

	var jsonRestos=[];

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			var jsonRestos=[];


			

			$('[attr-gtm-type="poi"]').each(function(i,element){

				// getting URL for address
				var data5= $(this).children('a').attr('href');

				var secondURL="https://restaurant.michelin.fr"+data5;

				var promise= new Promise(function(resolve,reject){

					request(secondURL,function(error,response,html){

						if(!error){
							var $ = cheerio.load(html);

							var jsonResto;
							var name;
							var stars;
							var food;
							var price;
							var address;
							var postalCode;
							var city;

							var data1=$('.poi_intro-description > .poi_intro-display-title').text().trim();
							name=data1;
							
							var data2=$('.guide-icon').attr('class').split(" ");
							var starTemp=data2[2];

							if(starTemp=="icon-cotation1etoile")
								stars="Une étoile";
							else if(starTemp=="icon-cotation2etoiles")
								stars="Deux étoiles";
							else if(starTemp=="icon-cotation3etoiles")
								stars="Trois étoiles";

							var data3=$('.poi_intro-display-cuisines').text().trim();
							food=data3;

							var data4=$('.poi_intro-display-prices').text().trim();
							price=data4;

							var data5=$('[class="thoroughfare"]').first().text();
							address=data5;

							var data6=$('[class="postal-code"]').first().text();
							postalCode=data6;

							var data7=$('[class="locality"]').first().text();
							city=data7;

							jsonResto={
								name: name,
								stars: stars,
								food: food,
								price: price,
								location: {
									address: address,
									postalCode: postalCode,
									city: city
								}
							};

							resolve(i);

						}

					}); // fin request

				}); // fin de la promise

				promise.then(function(resto){

					//jsonRestos.push(resto);
					console.log(resto);

				});

				promise.catch(function(e){
					console.log(e);

				});

				/* SAUVEGARDE

				FIN DE LA SAUVEGARDE */

			});

			
		
			

		}

	});
}

function Test(){
	console.log('test');
}

ScrapingPages();