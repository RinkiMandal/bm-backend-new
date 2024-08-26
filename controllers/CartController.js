const Cart = require('../models/Cart');
const ShippingAddress = require('../models/ShippingAddress');
const Order = require('../models/Order');
const DeliveredOrder = require('../models/DeliveredOrder');
const ReturnRequest = require('../models/ReturnRequest');
const TotalReturnOrders = require('../models/TotalReturnOrders');
const { startOfDay, startOfWeek, startOfMonth } = require('date-fns');



exports.postcart = async (req, res) => {
    const { email, productId, quantity } = req.body;
  
    if (!email || !productId || !quantity) {
      return res.status(400).json({ error: 'Email, product ID, and quantity are required' });
    }
  
    try {
      const cartItem = new Cart({
        email,
        productId,
        quantity,
      });
  
      await cartItem.save();
      res.status(201).json({ message: 'Product added to cart' });
    } catch (error) {
      console.error('Error adding product to cart:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

exports.getcartdata = async (req, res) => {
    try {
      const { email } = req.params;
      const cartItems = await Cart.find({ email }).populate('productId');
      res.status(200).json(cartItems);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cart items', error });
    }
  };

 exports.deletecartdata = async (req, res) => {
    const { email, productId } = req.params;
  
    try {
      const cartItem = await Cart.findOneAndDelete({ email, productId });
      
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
      console.error('Error removing cart item', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  exports.updatequantityincart = async (req, res) => {
    const { email, productId } = req.params;
    const { quantity } = req.body;
  
    try {
      const updatedCartItem = await Cart.findOneAndUpdate(
        { email, productId },
        { quantity },
        { new: true, runValidators: true }
      );
  
      if (!updatedCartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      res.json(updatedCartItem);
    } catch (error) {
      console.error('Error updating cart item quantity', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  exports.getproductincart = async (req, res) => {
    const { email, productId } = req.query;
  
    try {
      const cartItem = await Cart.find({ email, productId });
      res.status(200).json(cartItem);
    } catch (error) {
      console.error('Error fetching cart item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  exports.ShippingAddress = async (req, res) => {
    const { UserEmail, firstName, lastName, gender, mobileNumber, email, addressLine1, addressLine2, pincode, city } = req.body;
  
    const newAddress = new ShippingAddress({
      UserEmail,
      firstName,
      lastName,
      gender,
      mobileNumber,
      email,
      addressLine1,
      addressLine2,
      pincode,
      city,
    });
  
    try {
      const savedAddress = await newAddress.save();
      res.status(200).json(savedAddress);
    } catch (error) {
      res.status(400).json({ message: 'Error saving address', error });
    }
  };


  exports.PostOrderData = async (req, res) => {
    const { email, cartItems, paymentMethod } = req.body;

    if (!email || !cartItems || !paymentMethod) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Fetch shipping address using the provided email
        const shippingAddress = await ShippingAddress.findOne({ UserEmail: email });

        if (!shippingAddress) {
            return res.status(404).json({ error: 'Shipping address not found' });
        }

        // Create a new order record with shipping address
        const order = new Order({
            email,
            cartItems,
            paymentMethod,
            checkoutDate: new Date(),
            shippingAddress: {
                firstName: shippingAddress.firstName,
                lastName: shippingAddress.lastName,
                gender: shippingAddress.gender,
                mobileNumber: shippingAddress.mobileNumber,
                addressLine1: shippingAddress.addressLine1,
                addressLine2: shippingAddress.addressLine2,
                pincode: shippingAddress.pincode,
                city: shippingAddress.city,
            },
        });

        await order.save();

        // Delete the shipping address after saving the order
        await ShippingAddress.deleteOne({ UserEmail: email });

        // Optionally, clear the user's cart after checkout
        // await Cart.deleteMany({ email });

        res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error during checkout', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.GetAllOrderData = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'cartItems.productId',
        model: 'Product',
        select: 'productName discountedPrice images',
      })
      .exec();

    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.UpdateOrderStatus = async (req, res) => {
  const orderId = req.params.orderId;
  const { orderStatus } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.DeleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Find the order by ID and delete it
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Respond with a success message or any other relevant data
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.PostDeliveredOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Find the order to be moved
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create a new DeliveredOrder entry
    const deliveredOrder = new DeliveredOrder({
      email: order.email,
      checkoutDate: order.checkoutDate,
      deliveryDate: new Date(), // Set delivery date or other relevant fields
      paymentMethod: order.paymentMethod,
      cartItems: order.cartItems,
      orderStatus: 'order delivered', // Optionally set the order status
      shippingAddress: order.shippingAddress, // Include shipping address
    });

    // Save the new DeliveredOrder
    await deliveredOrder.save();

    // Delete the original order
    // await Order.findByIdAndDelete(orderId);

    res.status(200).json({ message: 'Order moved to DeliveredOrder model' });
  } catch (error) {
    res.status(500).json({ message: 'Error moving order', error });
  }
};

exports.getorderdata = async (req, res) => {
  try {
    const orders = await Order.find({ email: req.params.email })
      .populate({
        path: 'cartItems.productId',
        select: 'productName discountedPrice images', 
      });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getdeliveredorder = async (req, res) => {
  const { email } = req.query;

  try {
    // Filter delivered orders by email
    const deliveredOrders = await DeliveredOrder.find({ email }).populate('cartItems.productId');
    res.json(deliveredOrders);
  } catch (err) {
    console.error('Error fetching delivered orders:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.CancelOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, orderStatus: 'pending' }, // Ensure order is pending before cancellation
      { orderStatus: 'cancelled', UserState: `Order cancelled by user at ${new Date().toLocaleString()}` },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found or cannot be cancelled." });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Error cancelling order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.ReturnRequest = async (req, res) => {
  const { orderId, productId, reason, email, address, city, state, pincode, mobileNumber, name } = req.body;

  // Check if all required fields are provided
  if (!orderId || !productId || !reason || !email || !address || !city || !state || !pincode || !mobileNumber || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newReturnRequest = new ReturnRequest({
      orderId,
      productId,
      reason,
      email,
      address,
      city,
      state,
      pincode,
      mobileNumber,
      name
    });

    const savedReturnRequest = await newReturnRequest.save();
    res.status(201).json(savedReturnRequest);
  } catch (error) {
    console.error('Error saving return request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.GetReturnProduct = async (req, res) => {
  try {
    const returnRequests = await ReturnRequest.find(); // Populate order details if needed
    res.json(returnRequests);
  } catch (error) {
    console.error('Error fetching return requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getdetailsfromdeliveredorder = async (req, res) => {
  try {
    const order = await DeliveredOrder.findById(req.params.orderId)
      .populate({
        path: 'cartItems.productId',
        select: 'productName discountedPrice images' // Select fields to populate
      });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching delivered order data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updatedeliverydate = async (req, res) => {
  const { id } = req.params;
  const { expectedDeliveryDate } = req.body;

  try {
    const returnRequest = await ReturnRequest.findById(id);
    if (!returnRequest) {
      return res.status(404).send('Return request not found');
    }

    returnRequest.expectedDeliveryDate = new Date(expectedDeliveryDate);
    await returnRequest.save();

    res.status(200).send('Expected delivery date updated successfully');
  } catch (error) {
    res.status(500).send('Error updating expected delivery date');
  }
};

exports.UpdateReturnStatus = async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  try {
    const returnRequest = await ReturnRequest.findById(id);
    if (!returnRequest) {
      return res.status(404).send('Return request not found');
    }

    returnRequest.orderStatus = orderStatus;
    await returnRequest.save();

    res.status(200).send('Order status updated successfully');
  } catch (error) {
    res.status(500).send('Error updating order status');
  }
};

exports.GetReturnrequestMatch = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const returnRequests = await ReturnRequest.find({ email });
    res.json(returnRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching return requests', error });
  }
};

exports.DeleteReturnrequest = async (req, res) => {
  const { requestId, orderId } = req.params;

  try {
    // Fetch the return request and delivered order details
    const returnRequest = await ReturnRequest.findById(requestId);
    const deliveredOrder = await DeliveredOrder.findById(orderId);

    if (!returnRequest || !deliveredOrder) {
      return res.status(404).send({ message: 'Return request or delivered order not found' });
    }

    // Calculate the total price of the returned order
    const totalPrice = deliveredOrder.cartItems.reduce((sum, item) => {
      return sum + (item.productId?.discountedPrice || 0) * item.quantity;
    }, 0);

    // Store details in TotalReturnOrders model
    await TotalReturnOrders.create({
      orderId: returnRequest.orderId,
      reason: returnRequest.reason,
      name: returnRequest.name,
      address: returnRequest.address,
      city: returnRequest.city,
      state: returnRequest.state,
      pincode: returnRequest.pincode,
      mobileNumber: returnRequest.mobileNumber,
      orderStatus: returnRequest.orderStatus,
      expectedDeliveryDate: returnRequest.expectedDeliveryDate,
      cartItems: deliveredOrder.cartItems,
      totalPrice,
    });

    // Delete the return request
    await ReturnRequest.findByIdAndDelete(requestId);

    // Delete the delivered order
    await DeliveredOrder.findByIdAndDelete(orderId);

    res.status(200).send({ message: 'Order deleted successfully and archived in TotalReturnOrders' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).send({ message: 'Error deleting order' });
  }
};

exports.GetDeliveredOrder =  async (req, res) => {
  try {
    const orders = await DeliveredOrder.find().populate('cartItems.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.TotalEarnings = async (req, res) => {
  const { timeUnit } = req.query; // 'day', 'week', or 'month'

  try {
    // Ensure valid timeUnit
    if (!['day', 'week', 'month'].includes(timeUnit)) {
      return res.status(400).json({ message: 'Invalid time unit' });
    }

    // Aggregation pipeline
    const pipeline = [
      { $unwind: '$cartItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'cartItems.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $addFields: {
          'cartItems.productPrice': '$product.discountedPrice'
        }
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: timeUnit === 'day' ? '%Y-%m-%d' :
                         timeUnit === 'week' ? '%Y-%U' : '%Y-%m',
                date: '$checkoutDate'
              }
            }
          },
          totalEarnings: {
            $sum: {
              $multiply: ['$cartItems.productPrice', '$cartItems.quantity']
            }
          }
        }
      },
      { $sort: { '_id.date': 1 } }
    ];

    const earnings = await DeliveredOrder.aggregate(pipeline);
    res.json(earnings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.GetCartBuynow = async (req, res) => {
  const { email, productId } = req.body;
  console.log("Received POST request at /api/getcartbuynow");
  console.log("Request body:", req.body);

  try {
    // Log the query parameters
    console.log("Querying Cart with:", { email, productId });

    const cartItem = await Cart.findOne({ email, productId });
    console.log("Cart item found:", cartItem);

    if (cartItem) {
      res.status(200).json(cartItem);
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    console.error("Error checking cart for product:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.GetAllDeliveredOrder = async (req, res) => {
  try {
    const deliveredOrders = await DeliveredOrder.find()
      .populate({
        path: 'cartItems.productId',
        model: 'Product',
        select: 'productName discountedPrice images',
      })
      .exec();

    res.json(deliveredOrders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.GetTotalReturnedOrders = async (req, res) => {
  try {
    const returnedOrders = await TotalReturnOrders.find()
      .populate({
        path: 'cartItems.productId',
        model: 'Product',
        select: 'productName discountedPrice images',
      })
      .exec();

    res.json(returnedOrders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};





