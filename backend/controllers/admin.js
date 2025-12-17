
const Company = require("../models/company");
const Agency = require("../models/agency");

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Company.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting company", error });
  }
};

exports.deleteCompanyByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const deleted = await Company.findOneAndDelete({ email });

    if (!deleted) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting company", error });
  }
};

exports.getAllAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find();
    res.status(200).json(agencies);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteAgencyById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Agency.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Agency not found" });
    }

    res.status(200).json({ message: "Agency deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting agency", error });
  }
};

exports.deleteAgencyByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const deleted = await Agency.findOneAndDelete({ email });

    if (!deleted) {
      return res.status(404).json({ message: "Agency not found" });
    }

    res.status(200).json({ message: "Agency deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting agency", error });
  }
};
