import orderModel from "../Models/OrderModel.js";
import userModel from "../Models/UserModel.js";
import productModel from "../Models/ProductModel.js";

const OrderPlace = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { items, amount, address } = req.body;
    if (!items || items.length === 0 || !amount || !address) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order data" });
    }

    const productIds = items.map((item) => item.productId);

    const products = await productModel.find({ _id: { $in: productIds } });

    if (!products.length) {
      return res
        .status(404)
        .json({ success: false, message: "No valid products found" });
    }

    const adminIds = [...new Set(products.map((p) => p.adminId.toString()))];
    if (adminIds.length > 1) {
      return res.status(400).json({
        success: false,
        message:
          "All products in this order must belong to the same admin. Please order separately.",
      });
    }
    const assignedAdminId = adminIds[0];

    const orderItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);
      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        image:
          Array.isArray(product.image) && product.image.length > 0
            ? product.image
            : ["/placeholder.png"],
        size: item.size,
        quantity: item.quantity,
      };
    });

    const newOrder = new orderModel({
      userId,
      items: orderItems,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      status: "OrderPlaced",
      date: Date.now(),
      assignedAdminId,
    });

    await newOrder.save();

    for (const item of orderItems) {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString()
      );
      if (product.stock >= item.quantity) {
        await productModel.findByIdAndUpdate(product._id, {
          $inc: { stock: -item.quantity },
        });
      } else {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}`,
        });
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    return res.json({
      success: true,
      message: "Order placed successfully and assigned to product's admin.",
      orderId: newOrder._id,
      assignedAdminId,
    });
  } catch (error) {
    console.error("OrderPlace Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const AllOrders = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: Admins only" });
    }

    const orders = await orderModel
      .find({ assignedAdminId: req.admin._id })
      .sort({ date: -1 });

    return res.json({ success: true, orders });
  } catch (error) {
    console.error("AllOrders Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const UserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orders = await orderModel.find({ userId }).sort({ date: -1 });

    return res.json({ success: true, orders });
  } catch (error) {
    console.error("UserOrders Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const UpdateStatus = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: Admins only" });
    }

    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID and status are required" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (!order.assignedAdminId.equals(req.userId)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot update this order",
      });
    }

    await orderModel.findByIdAndUpdate(orderId, { status });
    return res.json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.error("UpdateStatus Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { OrderPlace, AllOrders, UserOrders, UpdateStatus };
