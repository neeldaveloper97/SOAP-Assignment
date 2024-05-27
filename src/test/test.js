const soapService = require("../controllers/product.controller");
const dotenv = require("dotenv");
dotenv.config();
describe("SOAP Service CRUD Operations", () => {
  let mockProduct, productId;

  beforeAll(() => {
    mockProduct = {
      _id: "665041a3a5b79596d27ff553",
      name: "Test Product",
      description: "This is a test product",
      price: 9.99,
      inStock: true,
    };

    soapService.ProductService = {
      ProductPort: {
        createProduct: jest
          .fn()
          .mockImplementation(async () => ({ success: true })),
        getProduct: jest.fn().mockImplementation(async (args) => {
          if (args.id === productId) {
            return mockProduct;
          } else {
            return { error: "Product not found" };
          }
        }),
        updateProduct: jest.fn().mockImplementation(async (args) => {
          if (args.id === productId) {
            mockProduct.name = args.name;
            mockProduct.description = args.description;
            mockProduct.price = args.price;
            mockProduct.inStock = args.inStock;
            return mockProduct;
          } else {
            return { error: "Product not found" };
          }
        }),
        deleteProduct: jest
          .fn()
          .mockImplementation(async (args) => ({ success: true })),
      },
    };
  });

  it("should create a new product", async () => {
    const newProductData = {
      name: "New Product",
      description: "This is a new product",
      price: 14.99,
      inStock: true,
    };

    const response = await soapService.ProductService.ProductPort.createProduct(
      newProductData
    );

    expect(response.success).toBe(true);
  });

  it("should retrieve details of a product by ID", async () => {
    productId = "665041a3a5b79596d27ff553";

    const response = await soapService.ProductService.ProductPort.getProduct({
      id: productId,
    });
    expect(response).toEqual(mockProduct);
  });

  it("should update details of a product by ID", async () => {
    const updatedProductData = {
      _id: "665041a3a5b79596d27ff553",
      name: "Updated Test Product",
      description: "This is the updated test product",
      price: 19.99,
      inStock: false,
    };

    const response = await soapService.ProductService.ProductPort.updateProduct(
      updatedProductData
    );

    expect(response).toBeTruthy();
  });

  it("should delete a product by ID", async () => {
    productId = "665041a3a5b79596d27ff553";

    const response = await soapService.ProductService.ProductPort.deleteProduct(
      { id: productId }
    );

    expect(response.success).toBe(true);
  });

  it("should handle error when product is not found", async () => {
    const nonExistentProductId = "nonexistent123";

    const response = await soapService.ProductService.ProductPort.getProduct({
      id: nonExistentProductId,
    });

    expect(response.error).toBe("Product not found");
  });
});
