const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
router.get("/companies", adminController.getAllCompanies);
router.delete("/companies/:id", adminController.deleteCompanyById);
router.delete("/companies", adminController.deleteCompanyByEmail);
module.exports = router;
