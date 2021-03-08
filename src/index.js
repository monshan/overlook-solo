// An example of how you tell webpack to use a CSS (SCSS) file
import Swal from 'sweetalert2'
import './css/base.scss';
import Rooms from './Rooms'
import Bookings from './Bookings'

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
// import './images/turing-logo.png'

const getRooms = () => {
  return fetch('http://localhost:3001/api/v1/rooms')
    .then(response => response.json())
}

const getBookings = () => {
  return fetch('http://localhost:3001/api/v1/bookings')
    .then(response => response.json())
}

const loadGlobals = () => {
  Promise.all([getRooms(), getBookings()])
    .then(([loadedRooms, loadedBookings]) => {
      globalRooms = new Rooms (loadedRooms)
      globalBookings = new Bookings (loadedBookings)
    })
}

loadGlobals();