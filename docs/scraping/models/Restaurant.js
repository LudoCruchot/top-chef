var mongoose = require('mongoose');

var restaurantSchema =  new mongoose.Schema({
	name: String,
	stars: Number,
	food: String,
	price: String,
	deals: [
		{
			deal: mongoose.Schema.Types.ObjectId,
			ref: 'Deal' // erreur
		}
	]
});

var Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;