const express = require('express');
const multer = require('multer');
const path = require('path');
const { createProduct,getAllProducts,getKitchenDining,getBedroomFurniture,
  getDrawingroomFurniture,getHomeFurniture,getOfficeFurniture,
  getOutdoorFurniture,getproductdetail,searchproduct, 
  getlatestproduct,updateproduct,getProductById,deleteproduct} = require('../controllers/productController');

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = uniqueSuffix + path.extname(file.originalname);
    console.log('Uploading file:', fileName); // Log the file name
    cb(null, fileName);
  }
});


const upload = multer({ storage: storage });

// Route for creating a product
router.post('/api/products', upload.array('images', 4), createProduct);
router.get('/api/getproducts', getAllProducts);
router.get('/api/getlatestproduct', getlatestproduct);
router.get('/api/getkitchendining', getKitchenDining);
router.get('/api/gethomefurniture', getHomeFurniture);
router.get('/api/getdrawingroomfurniture', getDrawingroomFurniture);
router.get('/api/getbedroomfurniture', getBedroomFurniture);
router.get('/api/getofficefurniture', getOfficeFurniture);
router.get('/api/getoutdoorfurniture', getOutdoorFurniture);
router.get('/api/products/:id', getproductdetail);
router.get('/api/searchproduct', searchproduct);
router.put('/api/updateproduct/:id', upload.array('images'), updateproduct);
router.get('/api/product/:id', getProductById);
router.delete('/api/deleteproduct/:id', deleteproduct);

module.exports = router;
