const express = require("express");

const router = express.Router();

// #1 import in the Product model
const {
    Product
} = require('../models')

// Import in createProductForm and bootstrapField
const {
    bootstrapField,
    createProductForm
} = require('../forms')


router.get('/', async (req, res) => {
    // #2 - fetch all the products (ie, SELECT * from products)

    let products = await Product.collection().fetch();
    res.render('products/index', {
        'products': products.toJSON() // #3 - convert collection to JSON
    })
})

router.get('/create', function (req, res) {
    const productForm = createProductForm();
    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField)
    })
})

router.post('/create', function (req, res) {
    const productForm = createProductForm();
    productForm.handle(req, {

        'success': async (form) => {

            const product = new Product();
            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('description', form.data.description);
            await product.save();
            res.redirect('/products');
        },
        'error': function (form) {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:product_id/update', async function (req, res) {
    const productId = req.params.product_id;
    const product = await Product.where({
        'id': productId
    }).fetch({
        'require': true
    })

    // CREATE INSTANCE OF PRODUCT FORM
    const productForm = createProductForm();
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })
})

router.post('/:product_id/update', async (req, res) => {
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });

    const productForm = createProductForm();
   
    productForm.handle(req, {
        'success': async function (form) {
            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('description', form.data.description);
            await product.save();
            res.redirect('/products');
        },

        'error':function(){
            
        }
    })


})

module.exports = router;