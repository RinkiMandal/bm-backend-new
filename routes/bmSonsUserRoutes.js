const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const bmSonsUserController = require('../controllers/bmSonsUserController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Banners/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/SignupBmsons', bmSonsUserController.signup);
router.post('/LoginBmsons', bmSonsUserController.login);
router.get('/api/AllUsersBmsons', bmSonsUserController.getAllUsers);
router.post('/api/wishlist', bmSonsUserController.postwishlist);
router.get('/api/wishlist', bmSonsUserController.getwishlist);
router.delete('/api/wishlist', bmSonsUserController.deletewishlist);
router.post('/api/recentlyviewed', bmSonsUserController.recentlyviewed);
router.get('/api/recentlyviewed', bmSonsUserController.getrecentlyviewed);
router.post('/api/uploadimage', upload.single('image'), bmSonsUserController.Bannerupload);
router.post('/api/bannerupload', bmSonsUserController.Bannerpathstore);
router.delete('/api/bannerimages/:id', bmSonsUserController.Bannerdelete);
router.get('/api/bannerimages', bmSonsUserController.getBanner);

module.exports = router;
