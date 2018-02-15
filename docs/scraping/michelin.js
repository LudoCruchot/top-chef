// cd /ESILV/annee4/WebApplication/top-chef/docs/scraping

//var express = require('express');
//var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var fs =require('fs');

var urlMichelin='https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';

var pageMax=0;
var nbRestos=0;

function AmountPages(callback){
// calcul le nombre de pages a scraper

	request(urlMichelin, function(error, response, html){

		if(!error){
			var $ = cheerio.load(html);

			$('li.mr-pager-item').each(function(i,element){

				var data= $(this).text();

				if(parseInt(data)>pageMax)
				{
					pageMax=parseInt(data);
				}

			});
			console.log("Nombre de pages de restos:",pageMax);
			callback(null,pageMax);
		}
	});
}


function ScrapingPages(){
// scraping restaurants
	AmountPages(function(err,results){
		console.log("Start scraping");

		var jsonRestos = [];

		var compteur=0;
		
		var i;
		for(i=0;i<2;i++)
		{

				var pageNumber=i;
				var url = urlMichelin;
				if(pageNumber>0)
				{
					url=url+'/page-'+pageNumber;
				}

				console.log("Scraping de la page "+(pageNumber+1));

				request(url, function(error, response, html){
					if(!error){
						var $ = cheerio.load(html);

						var nbRestosPage=$('[attr-gtm-type="poi"]').length;

						nbRestos = nbRestos + nbRestosPage;

						var count=0;


						$('[attr-gtm-type="poi"]').each(function(i,element){

							// getting URL for address
							var data5= $(this).children('a').attr('href');

							var secondURL="https://restaurant.michelin.fr"+data5;

							return new Promise(function(resolve,reject){
								request(secondURL, function(error,rresponse,html){

									if(!error){
										var $ = cheerio.load(html);

										console.log('Scan resto'+secondURL);

										var name=$('.poi_intro-description > .poi_intro-display-title').text().trim();
										
										var starsClass=$('.guide-icon').attr('class').split(" ");
										var starTemp=starsClass[2];
										var stars="";

										if(starTemp=="icon-cotation1etoile")
											stars="Une étoile";
										else if(starTemp=="icon-cotation2etoiles")
											stars="Deux étoiles";
										else if(starTemp=="icon-cotation3etoiles")
											stars="Trois étoiles";

										var food=$('.poi_intro-display-cuisines').text().trim();

										var price=$('.poi_intro-display-prices').text().trim();

										var address=$('[class="thoroughfare"]').first().text();

										var postalCode=$('[class="postal-code"]').first().text();

										var city=$('[class="locality"]').first().text();

										var jsonResto={
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

										resolve(jsonResto);
									}
								});

							}) // fin promise
							.then(function(result){
								jsonRestos.push(result);
								console.log('Resto added '+secondURL);
								console.log("Nombre de restos dans le tab: "+jsonRestos.length);
								console.log("Nombre restos total "+nbRestos);

								if(jsonRestos.length==nbRestos){
									fs.writeFile('TEST_info_resto.json', JSON.stringify(jsonRestos, null, 4), function(err){
										if(err){
											console.log(err);
										}
										console.log("Fichier JSON créé avec succès");
									}); // fin writeFile
								}



							})
							.catch(function(error){
								console.log(error);
							});

						}); // fin function
					
					}

				});
		}

	});
}

ScrapingPages();


