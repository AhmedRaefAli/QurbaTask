const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const HttpError = require('../middlewares/http-error');
const Restaurants = require('../models/restaurants');
const User = require('../models/user');

const getAllRestaurants = async(req,res,next)=>{
    try {
        const restaurants = await Restaurants.find();
        res.status(200).json({ restaurants: restaurants});
    } catch (err) {
        const error = new HttpError(
            'could not get a list of all Restaurants',
            500
            );
            return next(error);
    }
}

const getRestaurantDetails = async(req,res,next)=>{
    const {id}=req.query;
    try {
        const restaurant = await Restaurants.find({_id:id});
        res.status(200).json({ restaurant: restaurant});
    } catch (err) {
        const error = new HttpError(
            'could not get Restaurant details',
            500
            );
            return next(error);
    }
}

const search = async (req,res,next)=>{
    const {name,email,number} = req.body;
    try {
        if(name!=null){
            const restaurant = await Restaurants.find({name:name});
            res.status(200).json({ restaurant: restaurant});
        }
        if(email!=null){
            const restaurant = await Restaurants.find({email:email});
            res.status(200).json({ restaurant: restaurant});
        }
        if(number!=null){
            const restaurant = await Restaurants.find({number:number});
            res.status(200).json({ restaurant: restaurant});
        }
    } catch (err) {
        const error = new HttpError(
            'could not find Restaurant matches',
            500
            );
            return next(error);
    }
}

const createRestaurant= async (req,res,next)=>{
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { name, email,number} = req.body;
    const restaurant = new Restaurants({
        name,
        email,
        number,
        _user: req.user._id
        // _user:id
    });
    try {
        
        const user = await User.findOne({_id:id});
        user.restaurants.push(restaurant._id);
        await user.save();
        await restaurant.save();
        res.status(201).json({ restaurant: restaurant ,message:"new restaurant created "});
    } catch (err) {
        res.send(500, err);
    }
}


const updateRestaurant = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { name, email,number } = req.body;
    const restaurantId = req.query.resId;
    
    let restaurant;
    try {
        restaurant = await Restaurants.findById(restaurantId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update Restaurant.',
            500
        );
        return next(error);
    }

    if(restaurant==null){
        const error = new HttpError('could not fount a restaurant with this id', 401);
        return next(error);
    }
    if (restaurant._user.toString() !== req.user._id) {
        const error = new HttpError('You are not allowed to edit this Restaurant.', 401);
        return next(error);
    }
    restaurant.name = name;
    restaurant.email = email;
    restaurant.number = number;
    try {
        await restaurant.save();
        res.status(200).json({ message: 'this restaurant edit done' });
    } catch (err) {
        const error = new HttpError(
            err.message,
            500
        );
        return next(error);
    }  
}

const deleteRestaurant = async (req, res, next) => {
    const restaurantId = req.query.resId;
    let restaurant;
    try {
        restaurant = await Restaurants.findById(restaurantId).populate('_user');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete Restaurant.',
            500
        );
        return next(error);
    }
    if (!restaurant) {
        const error = new HttpError('Could not find Restaurant for this id.', 404);
        return next(error);
    }
    if (restaurant._user.id !== req.user._id) {
        const error = new HttpError(
            'You are not allowed to delete this Restaurant.',
            401
        );
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        restaurant._user.restaurants.pull(restaurant);
        await restaurant._user.save({ session: sess });
        await restaurant.remove({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong ..., could not delete place.',
            500
    );
        return next(error);
    }
    res.status(200).json({ message: 'Deleted Restaurant.' });
};  

exports.getAllRestaurants=getAllRestaurants;
exports.getRestaurantDetails=getRestaurantDetails;
exports.search=search;
exports.createRestaurant=createRestaurant;
exports.deleteRestaurant=deleteRestaurant;
exports.updateRestaurant=updateRestaurant;