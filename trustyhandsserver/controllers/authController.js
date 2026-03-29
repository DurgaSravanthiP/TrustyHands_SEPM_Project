import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
      phone,
      address,
      workerDetails
    } = req.body;

    if (!fullName || !email || !password || !role || !phone || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["customer", "worker", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userPayload = {
      fullName,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
    };

    if (role === "worker") {
      if (!workerDetails?.skill || !workerDetails?.experience || !workerDetails?.idProof) {
        return res.status(400).json({ message: "Worker skill, experience and idProof are required" });
      }
      userPayload.workerDetails = {
        skill: workerDetails.skill,
        experience: workerDetails.experience,
        serviceArea: workerDetails.serviceArea || "",
        idProof: workerDetails.idProof,
        profilePhoto: workerDetails.profilePhoto || "",
        status: "pending",
      };
    }

    const user = await User.create(userPayload);

    return res.status(201).json({ message: "User created", user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await User.findOne({ email });
    if (!user || user.role !== role) {
      return res.status(401).json({ message: "Invalid email/role or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email/role or password" });
    }

    if (role === "worker") {
      const dbStatus = user.workerDetails?.status || user.status || "";
      console.log(`[DEBUG] Login attempt for worker: ${email}. DB Status: "${dbStatus}"`);
      
      const isApproved = dbStatus.toLowerCase().trim() === "approved";
        
      if (!isApproved) {
        console.log(`[DEBUG] Worker ${email} not approved. Access Denied.`);
        return res.status(403).json({ message: "Waiting for admin approval" });
      }
      console.log(`[DEBUG] Worker ${email} approved. Access Granted.`);
    }

    const safeUser = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };

    return res.status(200).json({ message: "Login success", user: safeUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { fullName, email, phone, address, workerDetails } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    
    if (address) {
      if (!user.address) user.address = {};
      if (address.line) user.address.line = address.line;
      if (address.city) user.address.city = address.city;
      if (address.state) user.address.state = address.state;
      if (address.pincode) user.address.pincode = address.pincode;
      user.markModified("address");
    }

    if (user.role === "worker" && workerDetails) {
      if (!user.workerDetails) user.workerDetails = {};
      if (workerDetails.skill) user.workerDetails.skill = workerDetails.skill;
      if (workerDetails.experience) user.workerDetails.experience = workerDetails.experience;
      if (workerDetails.serviceArea) user.workerDetails.serviceArea = workerDetails.serviceArea;
      user.markModified("workerDetails");
    }

    await user.save();
    return res.status(200).json({ message: "Profile updated successfully", user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error updating profile" });
  }
};