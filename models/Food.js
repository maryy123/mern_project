const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: false, unique: true },
    seller: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "user",
      required: true,
    },
    image: { type: String, required: true },

    // category: { type: String, required: true },
    description: { type: String, required: false },
    previousPrice: { type: Number, required: false },
    price: { type: Number, required: false },
    qtyInStock: { type: Number, required: false },
    rating: { type: Number, required: false },
    numReviews: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

module.exports = Food = model("food", foodSchema);
