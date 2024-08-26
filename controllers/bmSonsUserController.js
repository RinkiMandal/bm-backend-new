const BmSonsUser = require('../models/BmSonsUser');
const Wishlist = require('../models/Wishlist');
const RecentlyViewed = require('../models/RecentlyViewed');
const Image = require('../models/Banner');

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    console.log('Received data:', { username, email, password });

    if (!username || !email) {
        console.log('Username, Email, and Password are required');
        return res.status(400).send('Username, Email, and Password are required');
    }

    try {
        // Check if user already exists
        const existingUser = await BmSonsUser.findOne({ email });
        if (existingUser) {
            return res.status(200).send('User already exists');
        }

        const user = new BmSonsUser({ username, email, password });
        await user.save();
        res.status(200).send('Signup successful');
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).send('Signup failed');
    }
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    
    BmSonsUser.findOne({ email, password })
        .then(user => {
            if (user) {
                // Send user details (e.g., name and email) in the response
                res.status(200).json({
                    message: 'Login successful',
                    name: user.username,
                    email: user.email
                });
            } else {
                res.status(401).send('Invalid credentials');
            }
        })
        .catch(err => res.status(500).send('Login failed'));
};


exports.getAllUsers = async (req, res) => {
    try {
        const items = await BmSonsUser.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.postwishlist = async (req, res) => {
    const { email, productId, date } = req.body;
  
    try {
        const existingWishlistItem = await Wishlist.findOne({ email, productId });
        if (existingWishlistItem) {
            return res.status(400).json({ msg: 'Product already in wishlist' });
        }

        const newWishlistItem = new Wishlist({ email, productId , date });
        await newWishlistItem.save();
        res.status(201).json(newWishlistItem);
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ error: 'Error adding to wishlist' });
    }
  };

  exports.getwishlist = async (req, res) => {
    try {
      const { email } = req.query;
      const wishlist = await Wishlist.find({ email }).populate('productId');
      res.json(wishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      res.status(500).json({ error: 'Error fetching wishlist' });
    }
  };
  

  exports.deletewishlist = async (req, res) => {
    const { email, productId } = req.query;
    try {
        await Wishlist.findOneAndDelete({ email, productId });
        res.status(200).json({ message: 'Item removed from wishlist' });
    } catch (error) {
        console.error('Error removing item from wishlist:', error);
        res.status(500).json({ error: 'Error removing item from wishlist' });
    }
};

exports.recentlyviewed = async (req, res) => {
    const { email, productId } = req.body;
  
    try {
      // Check if the record already exists
      const existingRecord = await RecentlyViewed.findOne({ email, productId });
  
      if (existingRecord) {
        // Update the viewedAt field if the record already exists
        existingRecord.viewedAt = Date.now();
        await existingRecord.save();
      } else {
        // Create a new record if it doesn't exist
        const recentlyViewed = new RecentlyViewed({ email, productId });
        await recentlyViewed.save();
      }
  
      res.status(200).json({ message: 'Product added to recently viewed.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add product to recently viewed.' });
    }
  };
  
  exports.getrecentlyviewed = async (req, res) => {
    const email = req.query.email;
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    try {
      const recentlyViewed = await RecentlyViewed.find({ email })
        .populate('productId')
        .sort({ viewedAt: -1 }); // Sort by viewedAt in descending order
      res.json(recentlyViewed);
    } catch (error) {
      console.error("Error fetching recently viewed products:", error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  exports.Bannerupload = (req, res) => {
    try {
        res.status(200).json({ imagePath: `Banners/${req.file.filename}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.Bannerpathstore = async (req, res) => {
  const { imagePath } = req.body;

  const image = new Image({ imagePath });

  try {
      const newImage = await image.save();
      res.status(201).json(newImage);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

exports.Bannerdelete = async (req, res) => {
  try {
      const image = await Image.findByIdAndDelete(req.params.id);
      if (!image) {
          return res.status(404).json({ message: 'Image not found' });
      }
      res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

exports.getBanner = async (req, res) => {
  try {
      const images = await Image.find();
      res.json(images);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


  
