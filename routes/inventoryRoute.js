// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:inventoryId", utilities.handleErrors(invController.getInventoryDetail));

// inventory management routes
router.get("/management", utilities.handleErrors(invController.buildManagementView))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//add classification routes
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

router.post(
    "/add-classification",
    validate.classificationRules(),
    validate.checkClassData,
    utilities.handleErrors(invController.addClassification)
)

// add inventory routes
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView))

router.post(
    "/add-inventory",
    validate.invRules(),
    validate.checkInvData,
    utilities.handleErrors(invController.addInventory)
)

// edit inventory routes
router.get("/edit/:inventory_id", utilities.handleErrors(invController.buildEditInventoryView))

router.post(
    "/update",
    validate.invRules(),
    validate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

module.exports = router;