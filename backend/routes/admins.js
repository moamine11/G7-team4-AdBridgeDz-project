const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
router.get("/companies", adminController.getAllCompanies);
router.delete("/companies/:id", adminController.deleteCompanyById);
router.delete("/companies", adminController.deleteCompanyByEmail);

router.get("/agencies", adminController.getAllAgencies);
router.delete("/agencies/:id", adminController.deleteAgencyById);
router.delete("/agencies", adminController.deleteAgencyByEmail);
module.exports = router;
