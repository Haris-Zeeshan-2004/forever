import userModel from "../Models/UserModel.js";

export async function addToCart(req, res) {
  try {
    const { itemId, size } = req.body;
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added to cart", cartData });
  } catch (error) {
    console.error("addToCart error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updatecart(req, res) {
  try {
    const { itemId, size, quantity } = req.body;
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Cart updated", cartData });
  } catch (error) {
    console.error("updatecart error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function gerUsercart(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No userId" });
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, cartData: userData.cartData || {} });
  } catch (error) {
    console.error("getUserCart error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}
