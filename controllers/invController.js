const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null
   })
}
/* ***************************
 *  Build inventory by Detail view
 * ************************** */
invCont.getInventoryDetail= async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryById(inventory_id)
  console.log(data);
  const details = await utilities.buildDetailsSection(data)
  let nav = await utilities.getNav()
  const className = `${data[0].inv_make} ${data[0].inv_model} ${data[0].inv_year}`
  res.render("./inventory/detail", {
    title: className, 
    nav,
    details,
    errors: null
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Inventory Management", 
    nav,
    classificationList,
    errors: null
  })
}

/* ****************************************
*  Deliver Add Classification view
* *************************************** */
invCont.buildAddClassification = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
  })
}

/* ***************************
 *  Add new classification
 * ************************** */

invCont.addClassification = async function(req, res, next) {
  const classification_name = req.body.classification_name
  const regResult = await invModel.addClassification(classification_name)
  let nav = await utilities.getNav()

  if (regResult) {
    req.flash("notice", `Congratulations, you've add the classification ${classification_name}.`)
    res.status(201).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
    }) 
  }else {
    req.flash("notice", "Sorry, we were unable to add the classification.")
    res.status(501).render("inventory/add-classification", {
        title: "Add Classifcation",
        nav,
        errors: null
    })
  }
}

invCont.buildAddInventoryView = async function(req, res, next) {
  const nav = await utilities.getNav();
  const classification_id = res.locals.classification_id;
  const classificationList = await utilities.buildClassificationList(classification_id);
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null
  })
}

invCont.addInventory = async function(req, res) {
  const { inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles,
    inv_color, 
    classification_id} = req.body

  const regResult = await invModel.addInventory(
    inv_make,
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color,
    classification_id
  )
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  if (regResult) {
    req.flash("notice", `Congratulations, you've added ${inv_make} ${inv_model} ${inv_year} to the inventory.`)
    res.status(201).render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList, 
        errors: null
    }) 
  }else {
    req.flash("notice", "Sorry, we were unable to add to the inventory.")
    res.status(501).render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors: null
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build Edit Inventory View
 * ************************** */
invCont.buildEditInventoryView = async function(req, res, next) {
  const nav = await utilities.getNav();
  const inventory_id = parseInt(req.params.inventory_id);
  const data = await invModel.getInventoryById(inventory_id)
  const itemData = data[0]
  const classificationList = await utilities.buildClassificationList(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

invCont.updateInventory = async function(req, res) {
  let nav = await utilities.getNav()
  const { 
    inv_id,
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles,
    inv_color, 
    classification_id} = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color,
    classification_id
  )
  if (updateResult) {
    const itemName = updateResult.rows[0].inv_make + " " + updateResult.rows[0].inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  }else {
    const classificationList = utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, we were unable to update the inventory.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

module.exports = invCont