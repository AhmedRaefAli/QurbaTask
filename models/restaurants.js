const mongoose = require('mongoose');

const { Schema } = mongoose;

const restaurantsSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    number:{type:Number,required:false,min:10},
    _user: { type: Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Restaurants', restaurantsSchema);
