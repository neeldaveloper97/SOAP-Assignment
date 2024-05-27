const Product = require("../models/product.model");

const soapService = {
  ProductService: {
    ProductPort: {
      createProduct: async (args) => {
        const product = new Product(args);
        await product.save();
        return { success: true, product };
      },
      getProduct: async (args) => {
        const product = await Product.findById(args.id);
        return product ? product.toObject() : { error: "Product not found" };
      },
      updateProduct: async (args) => {
        const product = await Product.findByIdAndUpdate(args.id, args, {
          new: true,
        });
        return product ? product.toObject() : { error: "Product not found" };
      },
      deleteProduct: async (args) => {
        const result = await Product.findByIdAndDelete(args.id);
        return result ? { success: true } : { error: "Product not found" };
      },
    },
  },
};

module.exports = {
  getServiceDefinition: () => ({
    ProductService: soapService.ProductService,
  }),
  getServiceObject: () => soapService,
};
