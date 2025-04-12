const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data);

  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ************************
 * Constructs the select HTML list for addInventoryForm
 ************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  console.log(data)
  
  let list = '<select name="classification_id" id="classificationList" required> '
  list += '<option value="">Choose a Classification</option>'
  data.rows.forEach((row) => {
    list += `<option value='${row.classification_id}'`
    if (classification_id != null && 
      row.classification_id == classification_id) {
        list +=" selected "
      }
    list += `> ${row.classification_name} </option>`
  })
  list += '</select>'
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}
/* ****************************************
 * Build detail section for inventory
 **************************************** */
Util.buildDetailsSection = async function(data){
  let details = '<div id="details">'
  details += '<img src="' + data[0].inv_image 
  +'" alt="Image of '+ data[0].inv_make + ' ' + data[0].inv_model 
  +' on CSE Motors" />'
  details += '<div class="info">'
  details += `<h2>${data[0].inv_make} ${data[0].inv_model} Details</h2>`
  details += `<p class=bold>Price: $ ${new Intl.NumberFormat('en-US').format(data[0].inv_price)}</h2>`
  details += `<p><span class=bold>Color:</span> ${data[0].inv_color}</p>`
  details += `<p><span class=bold>Mileage: </span>${new Intl.NumberFormat('en-US').format(data[0].inv_miles)}</p>`
  details += `<p><span class=bold>Description: </span>${data[0].inv_description}</p>`
  details += '</div></div>'
  return details
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
    next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if(res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check Account Type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.accountData.account_type === 'Admin' || res.locals.accountData.account_type === 'Employee'){
    next()
  } else {
    req.flash("notice", "Please log in as an Employee or Admin.")
    return res.redirect("/account/login")
  }
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util;