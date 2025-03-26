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

module.exports = invCont