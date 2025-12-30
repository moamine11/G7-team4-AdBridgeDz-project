const Company = require("../models/company");
const Agency = require("../models/agency");
const Booking = require("../models/booking");

const DEFAULT_SUBSCRIPTION_DAYS = 30;

function computeSubscriptionEndsAt(baseDate) {
  const base = baseDate ? new Date(baseDate) : new Date();
  return new Date(base.getTime() + DEFAULT_SUBSCRIPTION_DAYS * 24 * 60 * 60 * 1000);
}

function computeDaysLeft(subscriptionEndsAt) {
  const end = new Date(subscriptionEndsAt);
  const diffMs = end.getTime() - Date.now();
  const days = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
  return Math.max(0, days);
}

// Companies

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPendingCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ isVerified: false })
      .select("name email industrySector createdAt isVerified")
      .lean();

    const normalized = companies.map((c) => {
      const subscriptionEndsAt = computeSubscriptionEndsAt(c.createdAt);
      return {
        ...c,
        subscriptionEndsAt,
        daysLeftInSubscription: computeDaysLeft(subscriptionEndsAt),
      };
    });

    res.status(200).json(normalized);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getVerifiedCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ isVerified: true })
      .select("name email industrySector createdAt isVerified")
      .lean();

    const normalized = companies.map((c) => {
      const subscriptionEndsAt = computeSubscriptionEndsAt(c.createdAt);
      return {
        ...c,
        subscriptionEndsAt,
        daysLeftInSubscription: computeDaysLeft(subscriptionEndsAt),
      };
    });

    res.status(200).json(normalized);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyCompany = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    company.isVerified = true;
    company.verifiedAt = company.verifiedAt || new Date();
    await company.save();

    res.status(200).json({
      success: true,
      message: "Company accepted successfully",
      verified: true,
    });
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

exports.getPendingAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find({ isVerified: false })
      .select(
        "agencyName email isVerified country city dateCreated businessRegistrationNumber rcDocument nifNisDocument otherDocument"
      )
      .lean();

    const normalized = agencies.map((a) => {
      const subscriptionEndsAt = computeSubscriptionEndsAt(a.dateCreated);
      return {
        ...a,
        // Backward compat: older records used `otherDocument`
        nifNisDocument: a.nifNisDocument || a.otherDocument,
        subscriptionEndsAt,
        daysLeftInSubscription: computeDaysLeft(subscriptionEndsAt),
      };
    });

    res.status(200).json(normalized);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getVerifiedAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find({ isVerified: true })
      .select("agencyName email isVerified country city dateCreated")
      .lean();

    const normalized = agencies.map((a) => {
      const subscriptionEndsAt = computeSubscriptionEndsAt(a.dateCreated);
      return {
        ...a,
        subscriptionEndsAt,
        daysLeftInSubscription: computeDaysLeft(subscriptionEndsAt),
      };
    });

    res.status(200).json(normalized);
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
    agency.verifiedAt = agency.isVerified ? new Date() : undefined;
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

exports.getTopAgenciesByBookings = async (req, res) => {
  try {
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 5));

    const top = await Booking.aggregate([
      { $group: { _id: "$agency", bookingCount: { $sum: 1 } } },
      { $sort: { bookingCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "agencies",
          localField: "_id",
          foreignField: "_id",
          as: "agency",
        },
      },
      { $unwind: "$agency" },
      {
        $project: {
          _id: "$agency._id",
          agencyName: "$agency.agencyName",
          email: "$agency.email",
          bookingCount: 1,
          isVerified: "$agency.isVerified",
          country: "$agency.country",
          city: "$agency.city",
          servicesOffered: "$agency.servicesOffered",
        },
      },
    ]);

    res.status(200).json(top);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTopCompaniesByBookings = async (req, res) => {
  try {
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 5));

    const top = await Booking.aggregate([
      { $group: { _id: "$company", bookingCount: { $sum: 1 } } },
      { $sort: { bookingCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "companies",
          localField: "_id",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },
      {
        $project: {
          _id: "$company._id",
          name: "$company.name",
          email: "$company.email",
          bookingCount: 1,
          isVerified: "$company.isVerified",
          industrySector: "$company.industrySector",
          location: "$company.location",
        },
      },
    ]);

    res.status(200).json(top);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --- Analytics ---

const startOfDayUtc = (d) => {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
};

exports.getAnalyticsOverview = async (req, res) => {
  try {
    const [
      companiesTotal,
      agenciesTotal,
      companiesPending,
      agenciesPending,
      bookingsTotal,
    ] = await Promise.all([
      Company.countDocuments({}),
      Agency.countDocuments({}),
      Company.countDocuments({ isVerified: false }),
      Agency.countDocuments({ isVerified: false }),
      Booking.countDocuments({}),
    ]);

    const now = new Date();
    const last7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [bookingsLast7Days, bookingsLast30Days] = await Promise.all([
      Booking.countDocuments({ createdAt: { $gte: last7 } }),
      Booking.countDocuments({ createdAt: { $gte: last30 } }),
    ]);

    res.status(200).json({
      companiesTotal,
      agenciesTotal,
      companiesPending,
      agenciesPending,
      bookingsTotal,
      bookingsLast7Days,
      bookingsLast30Days,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBookingsDaily = async (req, res) => {
  try {
    const days = Math.min(90, Math.max(7, Number(req.query.days) || 30));

    const today = startOfDayUtc(new Date());
    const start = new Date(today.getTime() - (days - 1) * 24 * 60 * 60 * 1000);

    const rows = await Booking.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const map = new Map(rows.map((r) => [r._id, r.count]));
    const series = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      series.push({ date: key, count: map.get(key) || 0 });
    }

    res.status(200).json({ days, start: start.toISOString(), series });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTopCities = async (req, res) => {
  try {
    const limit = Math.min(20, Math.max(3, Number(req.query.limit) || 5));

    const [topAgencyCities, topCompanyLocations, topBookingCitiesByAgency] = await Promise.all([
      Agency.aggregate([
        { $match: { isVerified: true } },
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
        { $project: { _id: 0, city: '$_id', count: 1 } },
      ]),
      Company.aggregate([
        { $match: { isVerified: true } },
        { $group: { _id: '$location', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
        { $project: { _id: 0, location: '$_id', count: 1 } },
      ]),
      Booking.aggregate([
        {
          $lookup: {
            from: 'agencies',
            localField: 'agency',
            foreignField: '_id',
            as: 'agency',
          },
        },
        { $unwind: '$agency' },
        { $group: { _id: '$agency.city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
        { $project: { _id: 0, city: '$_id', count: 1 } },
      ]),
    ]);

    res.status(200).json({
      topAgencyCities,
      topCompanyLocations,
      topBookingCitiesByAgency,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
