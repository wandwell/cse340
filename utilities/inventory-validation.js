const utilities = require('.')
const {body, validationResult} = require('express-validator')
const inventoryModel = require('../models/inventory-model')
const validate = {}

validate.classificationRules = () => {
    return [
        //classifcation_name required, must be a string, no spaces or special characters, cannot exist
        body("classification_name")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .isAlphanumeric()
        .withMessage("Classification Name cannot contain spaces or special characters")
        .custom(async (classification_name) => {
            const classExists = await inventoryModel.checkExistingClass(classification_name)
            if (classExists){
                throw new Error("Classification already exists")
            }
        })
    ]
}

validate.invRules = () => {
    return[
        body("inv_make")
            .trim()
            .notEmpty().withMessage("Make Name Is Required")
            .isAlphanumeric()
            .withMessage("Model Name cannot contain spaces or special characters"),
        body("inv_model")
            .trim()
            .notEmpty().withMessage("Model Name is Required")
            .isAlphanumeric()
            .withMessage("Model Name cannot contain spaces or special characters"),
        body("inv_year")
            .trim()
            .isLength(4).withMessage("Year must be 4 digits")
            .isNumeric()
            .withMessage("Year must be 4 digits"), 
        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Description: Invalid Input"),
        body("inv_price")
            .isNumeric()
            .notEmpty()
            .withMessage("Price must contain numbers only"),
        body("inv_miles")
            .isNumeric()
            .notEmpty()
            .withMessage("Mileage must contain numbers only"),
        body("inv_color")
            .trim()
            .notEmpty()
            .withMessage("Color"),
        body("classification_id")
            .notEmpty().withMessage("class")
            .withMessage("Please Select a classification")
    ]
}

validate.checkClassData = async(req, res, next) => {
    const {classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
          errors,
          title:"Add Classification",
          nav,
          classification_name
        })
        return
      }
}

validate.checkInvData = async(req, res) => {
    const {inv_make,
        inv_model, 
        inv_year, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_miles, 
        inv_color,
        classification_id} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList()
        res.render("inventory/add-inventory", {
            errors,
            title:"Add Classification",
            nav,
            classificationList,
            inv_make,
            inv_model, 
            inv_year, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color,
            classification_id,
        })
        return
      }
}

module.exports = validate