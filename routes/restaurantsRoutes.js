const express= require('express');
const router = express.Router();
const { check } = require('express-validator');
const checkAuth = require('../middlewares/check-auth');
const restController = require('../controllers/restaurantsControllers');

router.get('/allRestaurant',checkAuth,restController.getAllRestaurants);
router.get('/restaurantDetails', restController.getRestaurantDetails);

router.get('/restaurant', restController.search);

router.post('/restaurant',
    [
        check('name')
        .not()
        .isEmpty(),
        check('email')
        .normalizeEmail()
        .isEmail(),
        check('number').isLength({ min: 8 }).isNumeric()
    ],
    checkAuth,
    restController.createRestaurant);

router.patch('/restaurant',
    [
        check('name')
        .not()
        .isEmpty(),
        check('email')
        .normalizeEmail()
        .isEmail(),
        check('number').isLength({ min: 8 }).isNumeric()
    ], 
    checkAuth, 
    restController.updateRestaurant)

router.delete('/restaurant', checkAuth, restController.deleteRestaurant)


module.exports = router;
