'use strict';



// eslint-disable-next-line no-unused-vars
const config = {
  style: 'mapbox://styles/wannes-vlaanderen/cljph5mll00ul01pq1e105wha',
  accessToken:
    'pk.eyJ1Ijoid2FubmVzLXZsYWFuZGVyZW4iLCJhIjoiY2xqb2Q0MDUxMDhjeDNtcGIxNjF4a2lrbyJ9.TmBAlCtIR-SS3YXwXvUJlA',
  CSV: 'https://docs.google.com/spreadsheets/d/10t7bnO7eSdR4qlB-F1etLpwUoRyPlWp5EVA9OsxzplM/gviz/tq?tqx=out:csv&sheet=Sheet1',
  center: [5.112,51.098],
  zoom: 8.5,
  title: 'ENA Gemeenten en Projecten',
  description:
    'Deze realisaties zijn het resultaat van verschillende projectoproepen zoals de proeftuinen onthardingen, groenblauwe dooradering en groenblauwe parels. Je kunt de lijst filteren op projectoproep, terreinfunctie en gebruikte methodes.',
  sideBarInfo: ['Titel'],
  popupInfo: ['Titel'],
  popupInfo2: ['Link'],
  popupInfo3: ['Beschrijving'],
  filters: [
    {
      type: 'dropdown', 
      title: 'Terreinfunctie',
      columnHeader: 'Terreinfunctie',
      listItems: [
        'Nieuw bedrijventerrein',
        'Bestaand bedrijventerrein',
        'Infrastructuurwerken'
      ],
    },
  ],
};


/* global config csv2geojson turf Assembly $ */
'use strict';

mapboxgl.accessToken = config.accessToken;
const columnHeaders = config.sideBarInfo;

let geojsonData = {};
const filteredGeojson = {
  type: 'FeatureCollection',
  features: [],
};

const map = new mapboxgl.Map({
  container: 'map',
  style: config.style,
  center: config.center,
  zoom: config.zoom,
  transformRequest: transformRequest,
  attributionControl: false
});

function flyToLocation(currentFeature) {
  map.flyTo({
    center: currentFeature,
    zoom: 13,
  });
}

function createPopup(currentFeature) {
  const popups = document.getElementsByClassName('mapboxgl-popup');
  /** Check if there is already a popup on the map and if so, remove it */
  if (popups[0]) popups[0].remove();
  new mapboxgl.Popup({ closeOnClick: true })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML(
  '<h3><strong>' +
    currentFeature.properties[config.popupInfo] +
    '</h3></strong>' + '<br>' + '<h3>' +
    currentFeature.properties[config.popupInfo3] +
    '</h3>' + '<br>' + '<h3>' +
    '<p><a href="' +
    currentFeature.properties[config.popupInfo2] +
    '" target="_blank">Meer info</a></p>' + '</h3>'
)
    .addTo(map);
}

function buildLocationList(locationData) {
  /* Add a new listing section to the sidebar. */
  const listings = document.getElementById('listings');
  listings.innerHTML = '';
  locationData.features.forEach((location, i) => {
    const prop = location.properties;

    const listing = listings.appendChild(document.createElement('div'));
    /* Assign a unique `id` to the listing. */
    listing.id = 'listing-' + prop.id;

    /* Assign the `item` class to each listing for styling. */
    listing.className = 'item';

    /* Add the link to the individual listing created above. */
    const link = listing.appendChild(document.createElement('button'));
    link.className = 'title';
    link.id = 'link-' + prop.id;
    link.innerHTML =
      '<p style="line-height: 1.25">' + prop[columnHeaders[0]] + '</p>';

    /* Add details to the individual listing. */
    const details = listing.appendChild(document.createElement('div'));
    details.className = 'content';

    for (let i = 1; i < columnHeaders.length; i++) {
      const div = document.createElement('div');
      div.innerText += prop[columnHeaders[i]];
      div.className;
      details.appendChild(div);
    }

    link.addEventListener('click', function () {
      const clickedListing = location.geometry.coordinates;
      flyToLocation(clickedListing);
      createPopup(location);

      const activeItem = document.getElementsByClassName('active');
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      this.parentNode.classList.add('active');

      const divList = document.querySelectorAll('.content');
      const divCount = divList.length;
      for (i = 0; i < divCount; i++) {
        divList[i].style.maxHeight = null;
      }

      for (let i = 0; i < geojsonData.features.length; i++) {
        this.parentNode.classList.remove('active');
        this.classList.toggle('active');
        const content = this.nextElementSibling;
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      }
    });
  });
}

setupFilter(config.filters)

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: true, // Use the geocoder's default marker style
  zoom: 11,
});

function sortByDistance(selectedPoint) {
  const options = { units: 'miles' };
  let data;
  if (filteredGeojson.features.length > 0) {
    data = filteredGeojson;
  } else {
    data = geojsonData;
  }
  data.features.forEach((data) => {
    Object.defineProperty(data.properties, 'distance', {
      value: turf.distance(selectedPoint, data.geometry, options),
      writable: true,
      enumerable: true,
      configurable: true,
    });
  });

  data.features.sort((a, b) => {
    if (a.properties.distance > b.properties.distance) {
      return 1;
    }
    if (a.properties.distance < b.properties.distance) {
      return -1;
    }
    return 0; // a must be equal to b
  });
  const listings = document.getElementById('listings');
  while (listings.firstChild) {
    listings.removeChild(listings.firstChild);
  }
  buildLocationList(data);
}

geocoder.on('result', (ev) => {
  const searchResult = ev.result.geometry;
  sortByDistance(searchResult);
});

map.on('load', () => {
  map.addControl(geocoder, 'top-right');
  map.removeControl(geocoder);

  // csv2geojson - following the Sheet Mapper tutorial https://www.mapbox.com/impact-tools/sheet-mapper
  console.log('loaded');
  $(document).ready(() => {
    console.log('ready');
    $.ajax({
      type: 'GET',
      url: config.CSV,
      dataType: 'text',
      success: function (csvData) {
        makeGeoJSON(csvData);
      },
      error: function (request, status, error) {
        console.log(request);
        console.log(status);
        console.log(error);
      },
    });
  });

  function makeGeoJSON(csvData) {
    csv2geojson.csv2geojson(
      csvData,
      {
        latfield: 'Latitude',
        lonfield: 'Longitude',
        delimiter: ',',
      },
      (err, data) => {
        data.features.forEach((data, i) => {
          data.properties.id = i;
        });

        geojsonData = data;
        // Add the the layer to the map
        map.addLayer({
          id: 'locationData',
          type: 'circle',
          source: {
            type: 'geojson',
            data: geojsonData,
          },
          paint: {
            'circle-radius': 5, // size of circles
            'circle-color': '#90884c', // color of circles
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.7,
          },
        });
      },
    );

    map.on('click', 'locationData', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['locationData'],
      });
      const clickedPoint = features[0].geometry.coordinates;
      flyToLocation(clickedPoint);
      sortByDistance(clickedPoint);
      createPopup(features[0]);
    });

    map.on('mouseenter', 'locationData', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'locationData', () => {
      map.getCanvas().style.cursor = '';
    });
    buildLocationList(geojsonData);
  }
});

const title = document.getElementById('title');
title.innerText = config.title;
const description = document.getElementById('description');
description.innerText = config.description;

function transformRequest(url) {
  const isMapboxRequest =
    url.slice(8, 22) === 'api.mapbox.com' ||
    url.slice(10, 26) === 'tiles.mapbox.com';
  return {
    url: isMapboxRequest ? url.replace('?', '?pluginName=finder&') : url,
  };
}

// Define bounds that conform to the `LngLatBoundsLike` object.
const bounds = [
[1.5,48.5], // [west, south]
[7,53.75]  // [east, north]
];
// Set the map's max bounds.
map.setMaxBounds(bounds);

map.addControl(new mapboxgl.AttributionControl({
  customAttribution: '<a href="https://omgeving.vlaanderen.be/nl/ena-economisch-netwerk-albertkanaal">ENA</a> <a href="https://omgeving.vlaanderen.be">omgeving.vlaanderen.be</a>'
}));

map.addControl(new LogoVlaanderen(map), "top-left")

//map.addControl(new Legenda(map), "top-right")
