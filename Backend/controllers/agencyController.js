import Agency from "../models/agencyModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerAgency = async (req, res) => {
  try {
    const { company_name, email, password, phone } = req.body;

    if (!company_name || !email || !password) {
      return res.status(400).json({ message: "Company name, email, and password are required." });
    }

    const existing = await Agency.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const agency = await Agency.create({
      company_name,
      email,
      password: hashedPassword,
      phone,
    });

    res.status(201).json({
      message: "Agency registered successfully.",
      agency: {
        id: agency._id,
        company_name: agency.company_name,
        email: agency.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

export const loginAgency = async (req, res) => {
  try {
    const { email, password } = req.body;

    const agency = await Agency.findOne({ email });
    if (!agency) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, agency.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: agency._id, role: "agency" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful.",
      token,
      agency: {
        id: agency._id,
        company_name: agency.company_name,
        email: agency.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};