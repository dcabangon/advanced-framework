const express = require("express");
const { createProductForm, bootstrapField } = require("../forms");
const router = express.Router();

// #1 import in the Product model
const {Product} = require('../models')

// Import in createProductForm and bootstrapField
const {bootstrapField, createProductForm} = require ('../forms')


router.get('/', async (req,res)=>{
    // #2 - fetch all the products (ie, SELECT * from products)

    let products = await Product.collection().fetch();
    res.render('products/index', {
        'products': products.toJSON() // #3 - convert collection to JSON
    })
})

router.get('/create' , function(req,res){
    res.send("Creating a new product");
})

module.exports = router;
