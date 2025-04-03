const updateForm = document.querySelector("#updateAccountForm")

updateForm.addEventListener("change", function () {
  const updateBtn = document.querySelector("button")
  updateBtn.removeAttribute("disabled")
})