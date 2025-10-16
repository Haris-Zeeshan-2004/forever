import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    bestseller: { type: Boolean, default: false },
    date: { type: Number, required: true },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

const productModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default productModel;
