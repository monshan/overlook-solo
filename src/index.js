// Imports
import Swal from 'sweetalert2'
import './css/base.scss';
import User from './User'
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

const getSingleUser = (loginID) => {
  return fetch('http://localhost:3001/api/v1/customers/' + loginID)
    .then(response => response.json())
}

const randomUser = () => {
  return Math.floor(Math.random() * 50)
}

const onLoad = () => {
  Promise.all([getRooms(), getBookings(), getSingleUser(randomUser())])
    .then(([loadedRooms, loadedBookings, loadedUser]) => {
      const roomsRepo = new Rooms (loadedRooms.rooms);
      const bookingsRepo = new Bookings (loadedBookings.bookings);
      const activeUser = new User (loadedUser);
      bookingsRepo.bookingsByUser(activeUser.id).forEach(entry => {
        return activeUser.addToBookingsRecord(entry);
      })
      activeUser.sortBookings();
      const billing = roomsRepo.calcHistoricalSpending(activeUser.billingRoomNumbers())
      populateBookings(activeUser.bookingsRecord)
      setSpendingMessage(billing)
    })
    .catch(err => console.log(err))
}

const setSpendingMessage = (amt) => {
  spendingMess.innerText = `You've spent $${amt.toFixed(2)} on all bookings with Overlook, thank you for choosing us!`
}

const populateBookings = (desiredBookings) => {
  userBookings.innerHTML = '';
  desiredBookings.forEach(book => {
    userBookings.innerHTML += `<section class="booking-card">
    <h3>${book.date}</h3>
    <p>Room Number: <span class="italics">${book.roomNumber}</span></p>
    <button>&#x02295</button>
  </section>`
  });
}

const populateRooms = (availableRooms) => {
  activeArea.innerHTML = '';
  availableRooms.forEach(room => {
    activeArea.innerHTML += `<section class="room-card" id="${room.number}">
    <h3>${room.roomType} ${room.number}</h3>
    <p>Bed Size: <span class="italics">${room.bedSize}</span></p>
    <p>Has Bidet: <span class="italics">${room.bidet}<span></p>
    <p>Number of Beds: <span class="italics"></span>${room.numBeds}</p>
    <p>Rate per Night: <span class="italics"></span>$${room.costPerNight.toFixed(2)}</p>
    <button class="book-this-room">&#x02295 book</button>
  </section>`
  })
}

const showAvailableRooms = () => {
  Promise.all([getRooms(), getBookings()])
    .then(([loadedRooms, loadedBookings]) => {
      const roomsRepo = new Rooms (loadedRooms.rooms);
      const bookingsRepo = new Bookings (loadedBookings.bookings);
      const filled = bookingsRepo.bookingsByDate(selectDate.value.replaceAll('-', '/'));
      const openRooms = roomsRepo.filterByAva(filled);
      populateRooms(openRooms);
    })
    .catch(err => console.log(err))
}

const advancedFilterRooms = () => {
  Promise.all([getRooms(), getBookings()])
    .then(([loadedRooms, loadedBookings]) => {
      const roomsRepo = new Rooms (loadedRooms.rooms);
      const bookingsRepo = new Bookings (loadedBookings.bookings);
      const filled = bookingsRepo.bookingsByDate(selectDate.value.replaceAll('-', '/'));
      const openRooms = roomsRepo.filterByAva(filled);
      if (roomTypeSelector.value) {
        const advancedRooms = filterByRoomType(openRooms, roomTypeSelector.value)
        populateRooms(advancedRooms);
      } else {
        populateRooms(openRooms);
      }
    })
    .catch(err => console.log(err))
}

const filterByRoomType = (set, desiredType) => {
  return set.filter(room => room.roomType === desiredType)
}

const postNewBooking = (newBooking) => {
  fetch("http://localhost:3001/api/v1/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newBooking)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json()
    })
    .catch(error => console.log(error))
}

const popModal = () => {
  let domID = event.target.closest('button').parentNode.id;
  let selectedDate = selectDate.value.replaceAll('-', '/');
  Swal.fire({
    title: 'Please confirm your booking information',
    text: `Date: ${selectedDate} Room Number: ${domID}`,
    icon: 'info',
    showCancelButton: true,
    footer: 'Overlook Hotel Bookings'
  })
    .then(result => {
    if (result.isConfirmed) {
      console.log(result)
    }
    })
  }

// Query Selectors
const spendingMess = document.getElementById('spendingMess');
const userBookings = document.getElementById('userBookings')
const selectDate = document.getElementById('selectDate')
const activeArea = document.getElementById('activeArea')
const roomTypeSelector = document.getElementById('roomTypeSelector')

// Fire on load & Event Listeners
onLoad();
selectDate.addEventListener('change', () => showAvailableRooms())
roomTypeSelector.addEventListener('change', () => advancedFilterRooms())
activeArea.addEventListener('click', () => popModal())