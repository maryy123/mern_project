const express = require("express");
const isAuth = require("../middleware/Auth");
const Food = require("../models/Food");
const Order = require("../models/Order");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./client/public/uploads/");
  },
  filename: (req, file, callback) => {
    callback(null, "-" + Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

//consult all food items:
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find().populate("seller");
    res.send({ msg: "All food items ", foods });
  } catch (error) {
    res.status(400).send({ msg: "food items can not be found", error });
  }
});

//consult all food items of a user:
//a isSellerorAdmin middleware should be added  //isAuth needs to be added
router.get("/my", isAuth, async (req, res) => {
  try {
    const id = req.user._id;
    const myItems = await Food.find({ seller: id });
    res.send({ msg: "My food items ", myItems });
  } catch (error) {
    res.status(400).send({ msg: "food items can not be found", error });
  }
});

//delete from my items:
router.delete(`/my/:_id`, isAuth, async (req, res) => {
  try {
    const { _id } = req.params;
    const item = await Food.findByIdAndDelete(_id);
    res.send({ msg: "Item deleted succ ", item });
  } catch (error) {
    res.status(400).send({ msg: "food items can not be deleted", error });
  }
});

//consult food by id:
router.get("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const foodItem = await Food.findById(_id).populate("seller");
    res.send({ msg: "food item found succ", foodItem });
  } catch (error) {
    res.status(400).send({ msg: "food can not be found", error });
  }
});

// add new food item:
//admin isAdminOrIsSeller middleware

router.post("/", isAuth, upload.single("image"), async (req, res) => {
  try {
    const foodItem = new Food({
      ...req.body,
      image: req.file.filename,
      seller: req.user._id,
    });
    await foodItem.save();
    res.send({ msg: "food item created succ ", foodItem });
  } catch (error) {
    res.status(400).send({ msg: "food item can not be added", error });
  }
});

router.put("/:_id", isAuth, upload.single("image"), async (req, res) => {
  try {
    const { _id } = req.params;
    const foodItem = await Food.findByIdAndUpdate(
      { _id },
      { $set: { ...req.body, image: req.file.filename || req.body.image } }
    );

    res.send({ msg: "food item updated succ ", foodItem });
  } catch (error) {
    res.status(400).send({ msg: "food item can not be updated", error });
  }
});

//delete food item:
//admin isAdminOrIsSeller middleware

router.delete("/:_id", isAuth, async (req, res) => {
  try {
    const { _id } = req.params;
    const foodItem = await Food.findById(_id);
    if (foodItem) {
      const deletedItem = await foodItem.remove();
      res.send({ msg: "food item deleted succ ", deletedItem });
    } else {
      res.status(404).send({ msg: "Food item not found" });
    }
  } catch (error) {
    res.status(400).send({ msg: "food item can not be updated", error });
  }
});

// update the qty for paid order:
router.put("/:_id/:_id1/pay", isAuth, async (req, res) => {
  try {
    const { _id } = req.params;
    const { _id1 } = req.params;
    const food = await Food.findById(_id);
    const order = await Order.findById(_id1);
    if (order.isPaid) {
      food.qtyInStock = food.qtyInStock - order.orderedItems.qty;
    } else {
      res.status(401).send({ msg: "order should be paid" });
    }

    await food.save();
    res.send({ msg: "Qty Updated Succ", food });
  } catch (error) {
    res.status(404).send({ message: "Qty Can Not Be Updated", error });
  }
});

module.exports = router;
