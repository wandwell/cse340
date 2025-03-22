const express = require("express")
const router = new express.Router() 
const errController = require("../controllers/errController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(errController.buildByClassificationId));

module.exports = router;