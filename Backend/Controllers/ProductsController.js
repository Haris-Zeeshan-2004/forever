import { v2 as cloudinary } from "cloudinary";
import ProductModel from "../Models/ProductModel.js";

export async function AddProduct(req, res) {
  try {
    const {
      name,
      description,
      price,
      category,
      subcategory,
      sizes,
      bestseller,
      stock,
    } = req.body;

    const files = [
      req.files.image1,
      req.files.image2,
      req.files.image3,
      req.files.image4,
    ]
      .filter(Boolean)
      .map((file) => file[0]);

    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
          folder: "products",
        });
        return result.secure_url;
      })
    );

    const newProduct = new ProductModel({
      name,
      description,
      category,
      subcategory,
      price: Number(price),
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true",
      image: imageUrls,
      date: Date.now(),
      stock: Number(stock) || 0,
      adminId: req.admin._id,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ success: true, message: "Product added", product: newProduct });
  } catch (error) {
    console.error("AddProduct error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function GetAdminProducts(req, res) {
  try {
    const products = await ProductModel.find({ adminId: req.admin._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("GetAdminProducts error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function UpdateProduct(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await ProductModel.findOne({
      _id: id,
      adminId: req.admin._id,
    });
    if (!product) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized or product not found" });
    }
    if (updateData.stock) {
      updateData.stock = Math.max(0, Number(updateData.stock)); 
    }

    await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ success: true, message: "Product updated" });
  } catch (error) {
    console.error("UpdateProduct error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function RemoveProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await ProductModel.findOne({
      _id: id,
      adminId: req.admin._id,
    });
    if (!product) {
      return res.status(403).json({
        success: false,
        message: "Access denied or product not found",
      });
    }

    await ProductModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product removed" });
  } catch (error) {
    console.error("RemoveProduct error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function GetSingleProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("GetSingleProduct error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function ListAllProducts(req, res) {
  try {
    const { adminId } = req.query;

    const filter = adminId ? { adminId } : {};
    const products = await ProductModel.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("ListAllProducts error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}
