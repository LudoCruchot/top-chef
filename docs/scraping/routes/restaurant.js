var router = require('express').Router();

var Restaurant = require('./../models/Restaurant');

router.get('/', (req, res)=>{
	Restaurant.find({}).populate('deals').then(restaurants =>{
		res.render('restaurants/index.html', {restaurants: restaurants});
	});


});

module.exports = router;