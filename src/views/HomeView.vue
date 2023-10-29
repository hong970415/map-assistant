<script setup lang="ts">
import { reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Paginator, { type PageState } from 'primevue/paginator'

interface Marker {
  id: string
  lat: number
  lng: number
  formattedAddress: string
  checked: boolean
}
interface MapState {
  currentLat: number
  currentLng: number
  markers: Array<Marker>
  currentPage: number
}
const ROWS_PER_PAGE = 10 as const
const state: MapState = reactive({
  currentLat: 0,
  currentLng: 0,
  markers: [],
  // markers: Array.from({ length: 90 }, (_, i) => ({
  //   id: uuidv4(),
  //   lat: i,
  //   lng: 1,
  //   formattedAddress: 'hi',
  //   checked: false
  // })),
  currentPage: 0
})
// getCurrentLocation
function getCurrentLocation() {
  const success = (position: GeolocationPosition) => {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude

    // console.log('success:', position)
    state.currentLat = latitude
    state.currentLng = longitude
  }
  const error = (err: GeolocationPositionError) => {
    console.log('getCurrentLocationErr:', err)
  }
  navigator.geolocation.getCurrentPosition(success, error, { timeout: 10000 })
}

// addMarker
function addMarker(lat: number, lng: number, formattedAddress: string) {
  state.markers = [
    ...state.markers,
    {
      id: uuidv4(),
      lat: lat,
      lng: lng,
      formattedAddress: formattedAddress,
      checked: false
    }
  ]
}

// setPlace
function setPlace(place: google.maps.GeocoderResult) {
  const latitude = place.geometry.location.lat(),
    longitude = place.geometry.location.lng(),
    formattedAddress = place.formatted_address
  state.currentLat = latitude
  state.currentLng = longitude
  addMarker(latitude, longitude, formattedAddress)
}

// deleteMarkerByIds
function deleteMarkerByIds() {
  state.markers = state.markers.filter((marker) => !marker.checked)
}

// onChangePage
function onChangePage(page: PageState) {
  state.currentPage = page.page
}

// getMarkerByPaging
function getMarkerByPaging() {
  return state.markers.slice(
    state.currentPage * ROWS_PER_PAGE,
    state.currentPage * ROWS_PER_PAGE + ROWS_PER_PAGE
  )
}
</script>
<template>
  <main>
    <div class="root">
      <GMapMap
        :center="{ lat: state.currentLat, lng: state.currentLng }"
        :zoom="7"
        map-type-id="terrain"
        class="map"
      >
        <GMapMarker
          :key="marker.id"
          v-for="marker in state.markers"
          :position="{ lat: marker.lat, lng: marker.lng }"
        />
      </GMapMap>
      <div class="p-inputgroup flex-1 inputContainer">
        <GMapAutocomplete
          class="p-inputtext"
          placeholder="Search for a location"
          @place_changed="setPlace"
          :select-first-on-enter="true"
        >
        </GMapAutocomplete>
        <Button @click="getCurrentLocation">Get Current Location</Button>
      </div>

      <div class="tableActionContainer">
        <Button @click="deleteMarkerByIds">Delete Selected Record</Button>
        <Paginator
          :rows="10"
          :totalRecords="state.markers.length === 0 ? 1 : state.markers.length"
          v-on:page="onChangePage"
        ></Paginator>
      </div>

      <table class="tableContainer">
        <tr>
          <th>-</th>
          <th>Address</th>
          <th>Lat</th>
          <th>Lng</th>
        </tr>
        <tr :key="marker.id" v-for="marker in getMarkerByPaging()">
          <td>
            <Checkbox v-model="marker.checked" :binary="true" />
          </td>
          <td>{{ marker.formattedAddress }} {{ marker.id }}</td>
          <td>{{ marker.lat }}</td>
          <td>{{ marker.lng }}</td>
        </tr>
      </table>
    </div>
  </main>
</template>

<!-- styles -->
<style scoped>
.root {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 24px;
}

.map {
  width: 100%;
  height: 500px;
  margin: 0px auto;
}
.inputContainer {
  padding: 18px 0px;
}

.tableActionContainer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tableContainer {
  width: 100%;
  padding: 20px;
}
.tableContainer th {
  text-align: left;
}
</style>
