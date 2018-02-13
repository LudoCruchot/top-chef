var express = require('express');
var mongoose = require('mongoose');
var nunjucks = require('nunjucks');

mongoose.connect('mongodb://localhost/top-chef');

require('./models/Restaurant');
//require('./models/Deal');

var app = express(); // instance nouvelle app express

app.use('/css',express.static(__dirname + '/node_modules/bootstrap/dist/css')); // récupérer fichier statique dans rep css

/* app.get('/',(req,res)=>{ //nouvelle route qui execute une fonction quand un user va sur la page / (accueil)
	// req = requete vers notre serveur, res = reponse envoyée au client
	res.send('Salut')
})*/

app.use('/', require('./routes/restaurants'));
//app.use('/', require('./routes/deals'));

nunjucks.configure('views',{   // config nunjucks
	autoescape: true,
	express: app
});

console.log('Webscraping lancé sur le port 3000');
app.listen(3000);