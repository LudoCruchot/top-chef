// API La Fourchette https://m.lafourchette.com/api/restaurant-prediction?name= + Nom resto ex: Auberge_duCheval

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

// CI DESSOUS sauvegarde d'une partie du code de michelin, a placer entre les balises SAUVEGARDE

// request pour chopper les infos sur la page du resto
				request(secondURL,function(error,response,html){ 
					//getting informations on the page of the restaurant

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

						jsonRestos.push(jsonResto);
						console.log(jsonResto);

					}

					fs.writeFile('info_resto.json', JSON.stringify(jsonRestos, null, 4), function(err){
						if(err){
							console.log(err);
						}
					}); // fin writeFile

				}); // fin request

