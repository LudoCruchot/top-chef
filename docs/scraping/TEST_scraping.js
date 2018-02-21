// cd /ESILV/annee4/WebApplication/top-chef/docs/scraping

//var express = require('express');
//var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var fs =require('fs');

var urlMichelin='https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
var urlAPILF='https://m.lafourchette.com/api/restaurant-prediction?';

var pageMax=0;
var nbRestos=630; // je n'arrive pas a calculer le nombre je ne sais pas pourquoi

//var jsonRestos=[];



function Scraping(){

	console.log('>start scraping');

	var TEST_nbPages;
	var TEST_nbRestos;
	var currentPage;

	return new Promise(function(resolve,reject){

		var jsonRestos=[];

		for(currentPage=0;currentPage<TEST_nbPages;currentPage++)
		{
			var url=urlMichelin;
			if(pageNumber>0)
				{
					url=url+'/page-'+pageNumber;
				}

				request(url, function(error, response, html){
					if(!error){
						var $ = cheerio.load(html);

						$('[attr-gtm-type="poi"]').each(function(i,element){

							var urlResto= $(this).children('a').attr('href');

							var secondURL="https://restaurant.michelin.fr"+urlResto;



						});



		}

		if(currentPage==(TEST_nbPages-1))
		{
			resolve(jsonRestos);
		}


	})then(function(jsonRestos){

		GetIdsLaFourchette(jsonRestos);

	});
}

function GetIdsLaFourchette(jsonRestos[]){

	console.log("> TEST fonction La Fourchette");

	for(var i in jsonRestos)
	{
		console.log(jsonRestos[i]);

	}

}