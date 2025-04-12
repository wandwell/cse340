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
router.get(
    "/management", 
    utilities.checkLogin, 
    utilities.checkAccountType, 
    utilities.handleErrors(invController.buildManagementView))

router.get(
    "/getInventory/:classification_id", 
    utilities.checkLogin,
    utilities.checkAccountType, 
    utilities.handleErrors(invController.getInventoryJSON))

router.get(
    "/getClass/:classification_id", 
    utilities.checkLogin,
    utilities.checkAccountType, 
    utilities.handleErrors(invController.getClassJSON))

//add classification routes
router.get(
    "/add-classification", 
    utilities.checkLogin,
    utilities.checkAccountType, 
    utilities.handleErrors(invController.buildAddClassification))

router.post(
    "/add-classification",
    validate.classificationRules(),
    validate.checkClassData,
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.addClassification)
)

// add inventory routes
router.get(
    "/add-inventory", 
    utilities.checkLogin,
    utilities.checkAccountType, 
    utilities.handleErrors(invController.buildAddInventoryView))

router.post(
    "/add-inventory",
    validate.invRules(),
    validate.checkInvData,
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.addInventory)
)

// edit inventory routes
router.get(
    "/edit/:inventory_id",
    utilities.checkLogin,
    utilities.checkAccountType, 
    utilities.handleErrors(invController.buildEditInventoryView))

router.post(
    "/update",
    validate.invRules(),
    validate.checkUpdateData,
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.updateInventory)
)

// delete inventory routes
router.get(
    '/delete/:inventory_id', 
    utilities.checkLogin,
    utilities.checkAccountType, 
    utilities.handleErrors(invController.buildDeleteInventoryView))

router. post(
    "/delete",
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventory)
)

//delete classification routes
router.get(
    '/delete-classification', 
    utilities.checkLogin,
    utilities.checkAccountType, 
    utilities.handleErrors(invController.buildDeleteClassificationView))

router.post(
    '/delete-classification',
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteClassification)
)

module.exports = router;