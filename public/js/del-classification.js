'use strict';

// Get a list of items in inventory based on the classification_id 
let classificationList = document.getElementById('classificationList');
let classification_nameInput = document.getElementById('classification_name');

classificationList.addEventListener('change', () => {
    let inventoryDisplay = document.getElementById('classificationInventoryDisplay')
    inventoryDisplay.innerHTML = ''
    let classification_id = classificationList.value
    console.log(`classification_id is: ${classification_id}`)
    let classIdURL = "/inv/getInventory/" + classification_id
    fetch(classIdURL)
    .then(function(response){
        if (response.ok){
            return response.json();
        }
        throw Error("Network response was not OK")
    })
    .then(function(data){
        console.log(data)
        buildInventoryList(data)
        fetchClassName(classification_id)
    })
    .catch(function(error){
        console.log('There was a problem: ', error.message) 
    })
})

// Build inventory items into HTML table components and inject into DOM
function buildInventoryList(data){
    // Clear out any existing data in the list
    let inventoryDisplay = document.getElementById('classificationInventoryDisplay')
    data.forEach(function(element) {
        console.log(element.inv_id + ", " + element.inv_model)
        let listElement = document.createElement('li');
        listElement.innerHTML = element.inv_make + element.inv_model
        inventoryDisplay.appendChild(listElement)
    }) 
}

function fetchClassName(classification_id){
    let classNameURL = "/inv/getClass/" + classification_id
    fetch(classNameURL)
    .then(function(response){
        if (response.ok){
            return response.json();
        }
        throw Error("Network response was not OK")
    }).then(function(data){
        console.log(data)
        classification_nameInput.value = data[0].classification_name
        
    }).catch(function(error){
        console.log('There was a problem: ', error.message) 
    })
}
