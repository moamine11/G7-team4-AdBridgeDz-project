import Client from "../models/clientModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerClient = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "Full name, email, and password are required." });
    }

    const existing = await Client.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await Client.create({
      full_name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Client registered successfully.",
      client: {
        id: client._id,
        full_name: client.full_name,
        email: client.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

export const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: client._id, role: "client" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful.",
      token,
      client: {
        id: client._id,
        full_name: client.full_name,
        email: client.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};