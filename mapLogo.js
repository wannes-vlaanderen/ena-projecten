class Legenda {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl';
    this._container.appendChild(this.newEntry("nieuw_bedrijventerrein", "Nieuw Bedrijventerrein"))
    this._container.appendChild(this.newEntry("bestaand_bedrijventerrein", "Bestaand Bedrijventerrein"))
    this._container.appendChild(this.newEntry("bos", "Natuurgebied"))
    this._container.appendChild(this.newEntry("regio", "Regio"))
    this._container.appendChild(this.newEntry("infrastructuurproject", "Infrastructuurproject"))
    this._container.width = 120
    this._container.classList.add("legenda")
    return this._container;
  }
  
  newEntry(color, text) {
    var container = document.createElement("div")
    var square = document.createElement("div")

    // box will display a box with the color inside
    square.classList.add("box");
    square.style.backgroundColor = color;
    container.innerHTML = text;
    
    // add child
    container.appendChild(square)
    return container
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

class LogoVlaanderen {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement('img');
    this._container.className = 'mapboxgl-ctrl';
    this._container.src = 'https://assets.vlaanderen.be/image/upload/widgets/vlaanderen-is-omgeving-logo.svg';
    this._container.width = 120
    this._container.href = "https://omgeving.vlaanderen.be"
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
