// cd /ESILV/annee4/WebApplication/top-chef/docs/scraping

//var express = require('express');
//var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var fs =require('fs');

var urlMichelin='https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
var urlAPILF='https://m.lafourchette.com/api/restaurant-prediction?';

var pageMax=0;
var nbRestos=0;

var jsonRestos=[];

var jsonRestosLF=[];

function AmountPages(callback){
// number of pages 
	AmmountRestaurants(function(err,results){
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
				console.log("Nombre de pages de restos: ",pageMax);
				callback(null,pageMax);
			}
		});
	});
}

function AmmountRestaurants(callback){  // ne fonctionne pas encore

	var url=urlMichelin;
	var pageNumber=0;

	//console.log("PASSE DANS LA fonction");

	while(pageNumber<pageMax)
	{
		console.log("PASSE DANS LA BOUCLE FOR");
		if(pageNumber>0){
			url=url+'/page-'+pageNumber;
			console.log(url);
		}
	
		request(url,function(error, response, html){

			if(!error){
				var $ = cheerio.load(html);
				var nbRestosPage=$('[attr-gtm-type="poi"]').length;
				nbRestos = nbRestos + nbRestosPage;
				console.log(nbRestos);
			}
			else{
				console.log(error);
			}
			callback(nbRestos);

		});
		pageNumber++;
	}
	callback(nbRestos);
}

function ScrapingMichelin(callback){   // note: pageMax et nbRestos remplacés par des constantes pour les test!!
// scraping restaurants
	AmountPages(function(err,results){
		console.log("Start scraping");
		
		var TEST_nbPages=2;
		var TEST_nbRestos=TEST_nbPages*18;
		
		var i;
		for(i=0;i<TEST_nbPages;i++)
		{

				var pageNumber=i;
				var url = urlMichelin;
				if(pageNumber>0)
				{
					url=url+'/page-'+pageNumber;
				}

				request(url, function(error, response, html){
					if(!error){
						var $ = cheerio.load(html);

						var nbRestosPage=$('[attr-gtm-type="poi"]').length;

						nbRestos = nbRestos + nbRestosPage;


						$('[attr-gtm-type="poi"]').each(function(i,element){

							var urlResto= $(this).children('a').attr('href');

							var secondURL="https://restaurant.michelin.fr"+urlResto;

							return new Promise(function(resolve,reject){
								request(secondURL, function(error,rresponse,html){

									if(!error){
										var $ = cheerio.load(html);

										console.log("> Scan: "+(jsonRestos.length+1)+" / "+TEST_nbRestos);

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
											idLF: '',
											stars: stars,
											food: food,
											price: price,
											promotion: '',
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

								if(jsonRestos.length==TEST_nbRestos){
									fs.writeFile('info_resto.json', JSON.stringify(jsonRestos, null, 4), function(err){
										if(err){
											console.log(err);
										}
										
									}); // fin writeFile
									console.log("JSON file created");
								}

							})
							.then(function(){

								if(jsonRestos.length==TEST_nbRestos){
									GetIdsLaFourchette();
								}

							});

						}); // fin function
					
					}

				}); // fin de la request
		} // fin de boucle for

	});
}

function GetIdsLaFourchette(){

	console.log("> Getting restaurants id from LaFourchette.com ...");

	Promise.all(jsonRestos.map((resto)=>{
		return new Promise((resolve, reject)=>{
			var nname=resto.name.replace("&","");
			var url=urlAPILF+"name="+nname;
			url=encodeURI(url);
			url=url.replace("'","%27");
			console.log(url);

			request({url:url,json:true},(error, response, body)=>{
				if(!error && body.length>0){
					var idResto;
					body.forEach((element)=>{
						if(element.address.postal_code == resto.location.postalCode){
							idResto=element.id;
							resto.idLF=idResto;
							console.log(idResto);
							resolve(idResto);
						}
					});
					resolve('');
				}
				else{
					resolve('');
				}
			}); // fin request

		}); // fin promise

	})) // fin map
	.then((result)=>{
		console.log("Restaurants list updated");
		console.log("Updating JSON file ...");

		fs.writeFile('info_resto.json', JSON.stringify(jsonRestos, null, 4), function(err){
			if(err){
				console.log(err);
			}
										
		}); // fin writeFile
		console.log("JSON file updated");

	})
	.then(()=>{
		GetPromos();
	})
	.catch((error)=>{
		console.log(error);
	});
	
}


function GetPromos(){

	console.log("> Getting promotions from LaFourchette.com ...");

	Promise.all(jsonRestos.map((resto)=>{
		return new Promise((resolve, reject)=>{
			if(resto.idLF!=''){
				var url='https://m.lafourchette.com/api/restaurant/'+resto.idLF+'/sale-type';
				//console.log(url);

				request({url:url,json:true},(error, response, body)=>{
					if(!error && body.length>0){
						var promo;
						body.forEach((element)=>{
							promo=element.title;
							resto.promotion=element.title;
							console.log(element.title);
							resolve(promo+" id "+resto.idLF);
						});
					}
					else{
						resolve('TEST1');
					}
				}); // fin request
			}
			else{
				resolve('TEST2');
			}
			
		}); // fin promise

	})) // fin map
	.then((result)=>{
		console.log(result);

	})
	.then((result)=>{
		fs.writeFile('restos.json', JSON.stringify(jsonRestos, null, 4), function(err){
			if(err){
				console.log(err);
			}
										
		}); // fin writeFile
	})
	.catch((error)=>{
		console.log(error);
	});
}


ScrapingMichelin();
//GetInfosLaFourchette();

