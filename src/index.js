// Imports
import Swal from 'sweetalert2'
import './css/base.scss';
import User from './User'
import Rooms from './Rooms'
import Bookings from './Bookings'

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
// import './images/turing-logo.png'
// let currentUser = null;
// let globalRooms = null;
// let globalBookings = null;

const getRooms = () => {
  return fetch('http://localhost:3001/api/v1/rooms')
    .then(response => response.json())
}

const getBookings = () => {
  return fetch('http://localhost:3001/api/v1/bookings')
    .then(response => response.json())
}

const getSingleUser = (loginID) => {
  return fetch('http://localhost:3001/api/v1/customers/' + loginID)
    .then(response => response.json())
}

const randomUser = () => {
  return Math.floor(Math.random() * 50)
}

const loadGlobals = () => {
  Promise.all([getRooms(), getBookings(), getSingleUser(randomUser())])
    .then(([loadedRooms, loadedBookings, loadedUser]) => {
      const roomsRepo = new Rooms (loadedRooms.rooms);
      const bookingsRepo = new Bookings (loadedBookings.bookings);
      const activeUser = new User (loadedUser);
      bookingsRepo.bookingsByUser(activeUser.id).forEach(entry => {
        return activeUser.addToBookingsRecord(entry);
      })
      const billing = roomsRepo.calcHistoricalSpending(activeUser.billingRoomNumbers())
      console.log(activeUser.bookingsRecord)
      populateBookings(activeUser.bookingsRecord)
      setSpendingMessage(billing)

      // assignGlobals(roomsOnly, loadedBookings, loadedUser)
    })
    .catch()
}

// const assignGlobals = (gotRooms, gotBookings, currUser) => {
//   globalRooms = new Rooms (gotRooms);
//   globalBookings = new Bookings (gotBookings);
//   currentUser = new User (currUser);
// }

const setSpendingMessage = (amt) => {
  spendingMess.innerText = `You've spent $${amt.toFixed(2)} on all bookings with Overlook, thank you for choosing us!`
}

const populateBookings = (desiredBookings) => {
  userBookings.innerHTML = '';
  desiredBookings.forEach(book => {
    userBookings.innerHTML += `<section class="booking-card">
    <h3>${book.date}</h3>
    <p>Room Number: <span class="italics">${book.roomNumber}</span></p>
  </section>`
  });
}

// Fire on load & Event Listeners

loadGlobals();

// Query Selectors
const spendingMess = document.getElementById('spendingMess');
const userBookings = document.getElementById('userBookings')

