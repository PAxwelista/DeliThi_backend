const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: String,
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;