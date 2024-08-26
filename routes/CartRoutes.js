const express = require('express');
const router = express.Router();
const cartcontroller = require("../controllers/CartController")



router.post('/api/postcart', cartcontroller.postcart);
router.get('/api/cart/:email', cartcontroller.getcartdata);
router.delete('/api/cart/:email/:productId', cartcontroller.deletecartdata);
router.put('/api/cart/:email/:productId', cartcontroller.updatequantityincart);
router.get('/api/cart', cartcontroller.getproductincart);
router.post('/api/shippingaddress', cartcontroller.ShippingAddress);
router.post('/api/postorderdata', cartcontroller.PostOrderData);
router.get('/api/getallorderdata', cartcontroller.GetAllOrderData);
router.put('/api/updateorderstatus/:orderId', cartcontroller.UpdateOrderStatus);
router.delete('/api/deleteorder/:orderId', cartcontroller.DeleteOrder);
router.post('/api/deliveredorder/:orderId', cartcontroller.PostDeliveredOrder);
router.get('/api/getorderdata/:email', cartcontroller.getorderdata);
router.get('/api/getdeliveredorder', cartcontroller.getdeliveredorder);
router.put('/api/cancelorder/:orderId', cartcontroller.CancelOrder);
router.post('/api/returnrequest', cartcontroller.ReturnRequest);
router.get('/api/getreturnrequestdata', cartcontroller.GetReturnProduct);
router.get('/api/getdeliveredorderdata/:orderId', cartcontroller.getdetailsfromdeliveredorder);
router.post('/api/updatereturndate/:id', cartcontroller.updatedeliverydate);
router.post('/api/updatereturnstatus/:id', cartcontroller.UpdateReturnStatus);
router.get('/api/getreturnrequestmatch', cartcontroller.GetReturnrequestMatch);
router.delete('/api/deletereturnrequest/:requestId/:orderId', cartcontroller.DeleteReturnrequest);
router.get('/api/totalearnings', cartcontroller.TotalEarnings);
router.post('/api/getcartbuynow', cartcontroller.GetCartBuynow);
router.get('/api/getalldeliveredorderdata', cartcontroller.GetAllDeliveredOrder);
router.get('/api/getallreturnedorderdata', cartcontroller.GetTotalReturnedOrders);

module.exports = router;