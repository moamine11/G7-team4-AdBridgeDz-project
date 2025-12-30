const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const adminAuth = require('../middleware/adminAuth');

// All admin routes require a valid Admin JWT
router.use(adminAuth);

// New signup requests (pending)
router.get("/companies/pending", adminController.getPendingCompanies);
router.get("/agencies/pending", adminController.getPendingAgencies);

// All accounts (accepted/verified)
router.get("/companies/verified", adminController.getVerifiedCompanies);
router.get("/agencies/verified", adminController.getVerifiedAgencies);

// Accept (verify) signup requests
router.patch("/companies/:id/verify", adminController.verifyCompany);
router.get("/companies", adminController.getAllCompanies);
router.delete("/companies/:id", adminController.deleteCompanyById);
router.delete("/companies", adminController.deleteCompanyByEmail);
router.get("/agencies", adminController.getAllAgencies);
router.delete("/agencies/:id", adminController.deleteAgencyById);
router.delete("/agencies", adminController.deleteAgencyByEmail);
router.patch("/agencies/:id/verify", adminController.toggleAgencyVerification);

// Top lists
router.get("/agencies/top-by-bookings", adminController.getTopAgenciesByBookings);
router.get("/companies/top-by-bookings", adminController.getTopCompaniesByBookings);

// Analytics
router.get('/analytics/overview', adminController.getAnalyticsOverview);
router.get('/analytics/bookings-daily', adminController.getBookingsDaily);
router.get('/analytics/top-cities', adminController.getTopCities);
module.exports = router;
