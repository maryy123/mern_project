const mongoose = require("mongoose");
const { model } = mongoose;

const orderSchema = new mongoose.Schema(
  {
    orderedItems: {
      name: { type: String, required: false },
      qty: { type: Number, required: false },
      // id: { type: Number, required: false },
      location: { type: String, required: false },
      image: { type: String, required: false },
      price: { type: Number, required: false },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: false,
      },
      seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    },

    shippingData: {
      fullName: { type: String, required: false },
      address: { type: String, required: false },
      phone: { type: String, required: false },
    },
    paymentMethode: { type: String, required: false },

    shippingPrice: { type: Number, required: false },

    //   the user who ordered :
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = Order = model("order", orderSchema);
