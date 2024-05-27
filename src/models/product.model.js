const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String },
  description: String,
  price: { type: Number },
  inStock: { type: Boolean },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
