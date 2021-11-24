const express = require("express");
const isAuth = require("../middleware/Auth");
const Food = require("../models/Food");
const Order = require("../models/Order");
const router = express.Router();

//create order:
router.post("/", isAuth, async (req, res) => {
  try {
    const order = new Order({
      orderedItems: req.body.orderedItems,
      shippingData: req.body.shippingData,
      shippingPrice: req.body.shippingPrice,
      user: req.user._id,
    });
    const newOrder = await order.save();
    res.status(201).send({ msg: "New Order Created", newOrder });
  } catch (err) {
    res.status(400).send({ msg: "can not create order", err });
  }
});

// isAdmin should be added
router.delete("/:id", isAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    const deleteOrder = await order.remove();
    res.send({ message: "Order Deleted", order: deleteOrder });
  } catch (err) {
    res.status(404).send({ message: "Order can not be deleted", err });
  }
});

//pay oerder:
router.put("/:_id/pay", isAuth, async (req, res) => {
  try {
    const { _id } = req.params;
    const order = await Order.findById(_id);
    order.isPaid = true;
    order.paidAt = Date.now();

    await order.save();
    res.send({ msg: "Order Paid Succ", order });
  } catch (error) {
    res.status(404).send({ message: "Order Can Not Be Paid", error });
  }
});

//consult my orders:
router.get("/myorders", isAuth, async (req, res) => {
  try {
    const id = req.user._id;
    const myOrders = await Order.find({ user: id });
    res.send({ msg: "My orders ", myOrders });
  } catch (error) {
    res.status(400).send({ msg: "orders can not be found", error });
  }
});

module.exports = router;
