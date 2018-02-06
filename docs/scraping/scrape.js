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

			// on passe deux boucles pour les 604 restos, optimiser pour n'en faire qu'une

			

			$('[attr-gtm-type="poi"]').each(function(i,element){
				var data1 = $(this).attr('attr-gtm-title');
				name=data1;

				var data2= $(this).children('a').children().children().children().children().attr('class');
				stars=data2;

				var arrayOfStrings = data2.split(" ");
				var starTemp=arrayOfStrings[2];

				if(starTemp=="icon-cotation1etoile")
					stars="Une étoile";
				else if(starTemp=="icon-cotation2etoiles")
					stars="Deux étoiles";
				else if(starTemp=="icon-cotation3etoiles")
					stars="Trois étoiles";
				
				console.log(name+"  "+stars);
				//console.log(stars);
			});  

		}

	});

}

ScrapingPages();