const Company = require("../models/company");
const Agency = require("../models/agency");

// Companies

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const company = await Company.findByIdAndDelete(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCompanyByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const company = await Company.findOneAndDelete({ email });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Agencies

exports.getAllAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find();
    res.status(200).json(agencies);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteAgencyById = async (req, res) => {
  try {
    const { id } = req.params;

    const agency = await Agency.findByIdAndDelete(id);

    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }

    res.status(200).json({ message: "Agency deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteAgencyByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const agency = await Agency.findOneAndDelete({ email });

    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }

    res.status(200).json({ message: "Agency deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Verification

exports.toggleAgencyVerification = async (req, res) => {
  try {
    const { id } = req.params;

    const agency = await Agency.findById(id);

    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }

    agency.isVerified = !agency.isVerified;
    await agency.save();

    res.status(200).json({
      success: true,
      message: `Agency ${agency.isVerified ? "verified" : "unverified"} successfully`,
      verified: agency.isVerified,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Top Agencies by Bookings

router.get('/admin/agencies/top-by-bookings', async (req, res) => {
  try {
    // Aggregate agencies by booking count
    const topAgencies = await Agency.aggregate([
      {
        $lookup: {
          from: 'bookings', // your bookings collection name
          localField: '_id',
          foreignField: 'agencyId', // field in booking that references agency
          as: 'bookings'
        }
      },
      {
        $addFields: {
          bookingCount: { $size: '$bookings' }
        }
      },
      {
        $sort: { bookingCount: -1 }
      },
      {
        $limit: 20 
      },
      {
        $project: {
          _id: 1,
          agencyName: 1,
          email: 1,
          bookingCount: 1,
          isVerified: 1,
          country: 1,
          city: 1,
          servicesOffered: 1
        }
      }
    ]);

    res.json(topAgencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
