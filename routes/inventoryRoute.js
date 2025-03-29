// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:inventoryId", utilities.handleErrors(invController.getInventoryDetail));

router.get("/management", utilities.handleErrors(invController.buildManagementView))

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

router.post(
    "/add-classification",
    validate.classificationRules(),
    validate.checkClassData,
    utilities.handleErrors(invController.addClassification)
)

router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView))

router.post(
    "/add-inventory",
    validate.invRules(),
    validate.checkInvData,
    utilities.handleErrors(invController.addInventory)
)

module.exports = router;