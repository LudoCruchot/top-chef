var mongoose = require('mongoose');

var dealSchema = new mongoose.Schema({
	name: String,
	default:'test'

});

typeSchema.virtual('restaurants', {
	ref: 'Restaurant',
	localField: 'id',
	foreignField: 'deals'

});