const Product = require('../models/Product');
const Cart = require('../models/Cart');
const path = require ("path")
const fs = require("fs");

const createProduct = async (req, res) => {
  try {
    const imagePaths = req.files.map(file => file.path);

    const newProduct = new Product({
      serialNumber: req.body.serialNumber,
      productName: req.body.productName,
      brandName: req.body.brandName,
      size: req.body.size,
      description: req.body.description,
      colour: req.body.colour,
      category: req.body.category,
      mrp: req.body.mrp,
      discountedPrice: req.body.discountedPrice,
      offer: req.body.offer,
      images: imagePaths,
      rating: req.body.rating,
      review: req.body.review,
      quantity: req.body.quantity
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product saved!', product: newProduct });
  } catch (err) {
    res.status(500).json({ error: 'Error saving product', details: err });
  }
};

const getAllProducts = async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching products', details: err });
    }
  };
  
  const updateproduct = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        serialNumber,
        productName,
        brandName,
        size,
        description,
        colour,
        category,
        mrp,
        discountedPrice,
        offer,
        rating,
        review,
        quantity
      } = req.body;
  
      // Find the existing product
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Handle image updates
      let updatedImages = [...existingProduct.images]; // Start with existing images
      if (req.files && req.files.length > 0) {
        // Log the file paths for debugging
        req.files.forEach(file => console.log('Uploaded file path:', file.path));

        // Get new image paths
        const newImagePaths = req.files.map(file => file.path);
        console.log('New image paths:', newImagePaths);

        // Remove old images from server
        existingProduct.images.forEach(imagePath => {
          const fullPath = path.join(__dirname, '..', imagePath); // Adjust path if needed
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });

        // Combine new images with existing images
        updatedImages = [...newImagePaths];
      }

      // Update the product
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          serialNumber,
          productName,
          brandName,
          size,
          description,
          colour,
          category,
          mrp,
          discountedPrice,
          offer,
          rating,
          review,
          quantity,
          images: updatedImages // Save the updated list of images
        },
        { new: true } // Return the updated product
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json(updatedProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };


  const getProductById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the product by ID
      const product = await Product.findById(id);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const deleteproduct = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find all cart entries that reference the product ID
      const cartEntries = await Cart.find({ productId: id });
  
      // Delete the product by ID
      const result = await Product.findByIdAndDelete(id);
  
      // Check if a product was found and deleted
      if (!result) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Delete all related cart entries
      await Cart.deleteMany({ productId: id });
  
      // Send success response
      res.status(200).json({ message: 'Product and related cart entries deleted successfully' });
    } catch (err) {
      // Handle errors
      console.error('Error deleting product and related cart entries:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  const getlatestproduct = async (req, res) => {
    try {
      const latestProducts = await Product.find().sort({ _id: -1 }).limit(12); // Adjust limit as needed
      res.json(latestProducts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const getKitchenDining =  async (req, res) => {
    try {
      const products = await Product.find({ category: 'Kitchen & Dining' });
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  const getOfficeFurniture =  async (req, res) => {
    try {
      const products = await Product.find({ category: 'Office Furniture' });
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  const getBedroomFurniture =  async (req, res) => {
    try {
      const products = await Product.find({ category: 'Bedroom Furniture' });
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  const getOutdoorFurniture =  async (req, res) => {
    try {
      const products = await Product.find({ category: 'Outdoor Furniture' });
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  const getDrawingroomFurniture =  async (req, res) => {
    try {
      const products = await Product.find({ category: 'Drawing Room Furniture' });
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  const getHomeFurniture =  async (req, res) => {
    try {
      const products = await Product.find({ category: 'Home Furniture' });
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  const getproductdetail = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).send('Product not found');
      res.json(product);
    } catch (error) {
      res.status(500).send('Server error');
    }
  };

  const searchproduct = async (req, res) => {
    const query = req.query.q;
    try {
      const products = await Product.find({
        $or: [
          { productName: { $regex: query, $options: 'i' } },
          { brandName: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
      });
      res.json(products);
    } catch (error) {
      console.error('Error searching for products:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };



module.exports = {
  createProduct,
  getAllProducts,
  getKitchenDining,
  getOfficeFurniture,
  getBedroomFurniture,
  getOutdoorFurniture,
  getDrawingroomFurniture,
  getHomeFurniture,
  getproductdetail,
  searchproduct,
  getlatestproduct,
  updateproduct,
  getProductById,
  deleteproduct,
};
