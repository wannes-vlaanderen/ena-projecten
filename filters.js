function createFilterPopup(parent) {
  const div1 = document.createElement("div")
  div1.id = "modal"
  div1.classList.add('absolute', 'top', 'right', 'bottom', 'left', 'scroll-auto', 'hide-visually', 'flex-parent', 'flex-parent--center-main', 'mt120-ml')
  const div2 = document.createElement("div")
  div2.classList.add('pt36')
  const div3 = document.createElement("div")
  div3.classList.add('flex-child', 'bg-white', 'round', 'relative', 'scroll-auto')
  const exitButton = document.createElement("div")
  exitButton.id = "exitButton"
  exitButton.classList.add('absolute', 'top', 'right', 'px12', 'py12')
  const exitButtonImage = document.createElement("svg")
  exitButtonImage.classList.add('icon', 'link', 'color-darken50')
  exitButtonImage.innerHTML = "<use xlink:href='#icon-close'></use>"
  exitButtonImage.innerHTML = "x"
  
  exitButton.appendChild(exitButtonImage)
  
  const filtersForm = document.createElement("div")
  filtersForm.classList.add('px24', 'py24')
  const filters = document.createElement("form")
  filters.id = 'filters'
  const div4 = document.createElement("div")
  div4.classList.add('align-center', 'py12')
  const div5 = document.createElement("div")
  div5.classList.add('flex-parent', 'flex-parent--center-main')
  const resetButton = document.createElement("button")
  resetButton.id = 'removeFilters'
  resetButton.classList.add('btn')
  resetButton.innerHTML = 'Filters Resetten'
  
  div5.appendChild(resetButton)
  
  filtersForm.appendChild(filters)
  filtersForm.appendChild(div4)
  filtersForm.appendChild(div5)
  
  div3.appendChild(exitButton)
  div3.appendChild(filtersForm)
  
  div2.appendChild(div3)
  div1.appendChild(div2)
  parent.appendChild(div1)

  // add button in sidebar
  const buttonDiv = document.getElementById('buttonDiv')
  const button = document.createElement("button")
  button.id = 'filterResults'
  button.classList.add('txt-bold', 'btn', 'btn--stroke', 'mr0-m1', 'mr12', 'px18-ml', 'px6')
  const buttonImage = document.createElement("svg")
  buttonImage.classList.add('icon', 'inline-block', 'align-middle', 'h24', 'w24')
  const use = document.createElement("use")
  buttonImage.innerHTML = "<use href='#icon-filter'></use>"
  const buttonText = document.createElement("p")
  buttonText.classList.add('inline-block-ml', 'align-middle', 'remove', 'none')
  buttonText.innerHTML = 'Toon filters'
  button.appendChild(buttonImage)
  button.appendChild(buttonText)
  buttonDiv.appendChild(button)
}
