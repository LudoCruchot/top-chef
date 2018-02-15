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


				function CreateJsonFile(){

	console.log('TEST');
	fs.writeFile('TEST_info_resto.json', JSON.stringify(jsonRestos, null, 4), function(err){
		if(err){
			console.log(err);
		}
	});
}

function ScanGlobal(){
	var promise= new Promise(function(resolve,reject){
		ScrapingPages();
	});
	promise.then(function(){
		console.log('TEST PROMISE'+jsonRestos.length);

	});
}


// scrapingPage SAUVEGARDE

function ScrapingPage(pageNumber){
// scrape page pour avoir url resto
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

				})
				.catch(function(error){
					console.log(error);
				});

			}); // fin function
		
		}

	});

	console.log("Nombre de restos dans le tab: "+jsonRestos.length);
}

