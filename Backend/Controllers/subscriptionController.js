import adminModel from "../Models/AdminModel.js";
import transport from "../Nodemailer/nodemailer.js";

export const createSubscription = async (req, res) => {
  try {
    const { email } = req.body;
    const adminId = req.userId; 

    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    if (!adminId)
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });

   
    const admin = await adminModel.findById(adminId);

    if (!admin || admin.role !== "admin")
      return res
        .status(403)
        .json({ success: false, message: "You are not admin" });

    
    await transport.sendMail({
      from: process.env.SENDER_EMAIL,
      to: admin.email,
      subject: "New Subscription",
      text: `User with email ${email} has subscribed.`,
    });

    return res.status(200).json({
      success: true,
      message: "Subscription successful, admin notified",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
