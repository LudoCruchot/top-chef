// cd /ESILV/annee4/WebApplication/top-chef/docs/scraping

//var express = require('express');
//var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var url='https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';

var url='https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
var pageMax=0;

function ScrapingPages(){
// scrape les 34 pages des restos
	AmountPages(function(err,results){
		//console.log(err,pageMax);
		console.log("Nombre de pages de restos:",pageMax);

		var i;
		for(i=0;i<pageMax+1;i++)
		{
			ScrapingPage(i);
		}


	});
}

function AmountPages(callback){
// calcul le nombre de pages a scraper

	//var pageMax=0;

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

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			var name;
			var stars;
			var food;
			var price;

			// on passe deux boucles pour les 604 restos, optimiser pour n'en faire qu'une

			

			$('[attr-gtm-type="poi"]').each(function(i,element){

				// getting the name
				var data1 = $(this).attr('attr-gtm-title');
				name=data1;

				// getting the number of stars
				var data2= $(this).children('a').children().children().children().children().attr('class');

				var starsHtml = data2.split(" ");
				var starTemp=starsHtml[2];

				if(starTemp=="icon-cotation1etoile")
					stars="Une étoile";
				else if(starTemp=="icon-cotation2etoiles")
					stars="Deux étoiles";
				else if(starTemp=="icon-cotation3etoiles")
					stars="Trois étoiles";
				

				// getting the type of food
				var data3= $(this).children('a').children('div').eq(1).children('div').eq(1).children().children().children('div').eq(0).text();

				data3=data3.trim(); // delete spaces before after
				food=data3;

				// getting the price
				var data4= $(this).children('a').children('div').eq(1).children('div').eq(1).children().children().children('div').eq(1).text();

				data4=data4.trim();
				price=data4;

				// getting URL for address
				var data5= $(this).children('a').attr('href');

				var secondURL="https://restaurant.michelin.fr"+data5;

				// request pour chopper les adresses
				request(secondURL,function(error,response,html){  // FONCTIONNE PAS ENCORE
					//getting address on the page of the restaurant

					if(!error){
						var $ = cheerio.load(html);
						var adress;

						var ad=$('[class="opt-upper-var2__address-text"]').children('div').eq(0).attr('class');

						//console.log(ad);
					}

				});



				console.log(secondURL);
				//console.log(name+" "+stars+" "+food+" "+price);
				//JsonConstructor(name,stars,food,price);

			});  

		}

	});

}

function JsonConstructor(jname,jstars,jfood,jprice){
// create ajson file with the informations scraped on the webpage

var jsonFile='{ "name":"'+jname+'", "stars":"'+jstars+'", "food_type":"'+jfood+'", "price":"'+jprice+'"}';

console.log(jsonFile);


}

ScrapingPages();