const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const errCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
errCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilitiess.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid
  })
}

module.exports = errCont;