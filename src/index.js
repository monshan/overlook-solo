// Imports
import Swal from 'sweetalert2'
import './css/base.scss';
import User from './User'
import Rooms from './Rooms'
import Bookings from './Bookings'

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
// import './images/turing-logo.png'
let globalRooms = null;
let globalBookings = null;
let globalUsers = null;
let currentUser = null;


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

const hide = (desiredElement) => {
  desiredElement.classList.add('hidden')
}

const onLoad = (userID) => {
  Promise.all([getRooms(), getBookings(), getSingleUser(userID)])
    .then(([loadedRooms, loadedBookings, loadedUser]) => {
      const roomsRepo = new Rooms (loadedRooms.rooms);
      const bookingsRepo = new Bookings (loadedBookings.bookings);
      const activeUser = new User (loadedUser);
      bookingsRepo.bookingsByUser(activeUser.id).forEach(entry => {
        return activeUser.addToBookingsRecord(entry);
      })
      activeUser.sortBookings();
      assignGlobals(roomsRepo, bookingsRepo, activeUser);
      updateUserBookings();
    })
    .catch(err => console.log(err))
}

const assignGlobals = (rooms, bookings, user) => {
  globalRooms = rooms;
  globalBookings = bookings;
  currentUser = user;
}

const updateUserBookings = () => {
  const billing = globalRooms.calcHistoricalSpending(currentUser.billingRoomNumbers())
  setSpendingMessage(billing)
  populateBookings(currentUser.bookingsRecord)
}

const setSpendingMessage = (amt) => {
  spendingMess.innerHTML = `You've spent <span class="aside__p__span">$${amt.toFixed(2)}</span> on all bookings with Overlook, thank you for choosing us!`
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

const populateRooms = (availableRooms) => {
  activeArea.innerHTML = '';
  availableRooms.forEach(room => {
    activeArea.innerHTML += `<section class="room-card" id="${room.number}">
    <h3>${room.roomType} ${room.number}</h3>
    <p>Bed Size: <span class="italics">${room.bedSize}</span></p>
    <p>Has Bidet: <span class="italics">${room.bidet}<span></p>
    <p>Number of Beds: <span class="italics">${room.numBeds}</span></p>
    <p>Rate per Night: <span class="italics">$${room.costPerNight.toFixed(2)}</span></p>
    <button class="book-this-room">&#x02295 book</button>
  </section>`
  })
}

const grabDate = () => {
  return selectDate.value.replaceAll('-', '/');
}

const determineReport = (filled, open) => {
  const rev = globalRooms.calcHistoricalSpending(filled);
  const occ = globalRooms.calcCapacity(filled);
  populateReport(open.length, occ, rev);
}

const populateReport = (count, occ, rev) => {
  reportCount.innerText = `${count} rooms available on ${grabDate()}`;
  reportOcc.innerText = `${occ}%`;
  reportRevenue.innerText = `$${rev.toFixed(2)}`;
}

const showAvailableRooms = () => {
  const filled = globalBookings.bookingsByDate(grabDate());
  const openRooms = globalRooms.filterByAva(filled);
  if (openRooms.length) {
    populateRooms(openRooms);
  } else {
    fireApology();
  }
  determineReport(filled, openRooms);
}

const advancedFilterRooms = () => {
  const filled = globalBookings.bookingsByDate(grabDate());
  const openRooms = globalRooms.filterByAva(filled);
  if (roomTypeSelector.value) {
    const advancedRooms = filterByRoomType(openRooms, roomTypeSelector.value)
    if (advancedRooms.length) {
      populateRooms(advancedRooms);
    } else {
      fireApology();
    }
  } else {
    if (openRooms.length) {
      populateRooms(openRooms);
    } else {
      fireApology();
    }
  }
  determineReport(filled, openRooms);
}

const fireApology = () => {
  return Swal.fire({
    title: 'So sorry!',
    text: 'There are no available rooms that mactch your preferences on this date, please select another date or adjust your search filters',
    icon: 'error',
    footer: 'Overlook Hotel Bookings'
  })
}

const cutID = (customerUN) => {
  return parseInt(customerUN.slice(8, customerUN.length))
}

const login = () => {
  if (username.value === 'manager' && password.value === 'overlook2021') {
    toManagerDash();
    hide(loginPage);
  } else if (password.value === 'overlook2021') {
    toUserDash(cutID(username.value))
    hide(loginPage);
  } else {
    Swal.fire({
      title: 'Hmm... are you sure?',
      text: 'Username or password invalid, please try logging in again with a different username or password',
      icon: 'error',
      footer: 'Overlook Hotel Bookings'
    })
  }
}

const toUserDash = (loginID) => {
  onLoad(loginID);
}

const filterByRoomType = (set, desiredType) => {
  return set.filter(room => room.roomType === desiredType)
}

const postNewBooking = (newBooking) => {
  return fetch("http://localhost:3001/api/v1/bookings", {
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
  let selectedRoom = globalRooms.rooms.find(room => room.number === parseInt(domID));
  let selectedDate = grabDate();
  const newBooking = {
    "id": "5fwrgu4i7k55hl600",
    "userID": currentUser.id,
    "date": selectedDate,
    "roomNumber": selectedRoom.number
  };
  Swal.fire({
    title: 'Please confirm your booking information',
    text: `Date: ${selectedDate} Room Number: ${selectedRoom.number} User: ${currentUser.name}`,
    icon: 'info',
    showCancelButton: true,
    footer: 'Overlook Hotel Bookings'
  })
    .then(result => {
    if (result.isConfirmed) {
      const confirmBooking = postNewBooking(newBooking)
      currentUser.bookingsRecord.unshift(confirmBooking);
      Swal.fire({
        title: 'See you then!',
        icon: 'success',
        text: `Your booking on ${selectedDate} is confirmed, if you would like to make chages or cancel your booking please access your 'My bookings' section`,
        footer: 'Overlook Hotel Bookings'
      })
    }
    })
}

const populateUsers = () => {
  
}

// Query Selectors
const spendingMess = document.getElementById('spendingMess');
const userBookings = document.getElementById('userBookings')
const selectDate = document.getElementById('selectDate')
const activeArea = document.getElementById('activeArea')
const roomTypeSelector = document.getElementById('roomTypeSelector')
const loginPage = document.getElementById('loginPage')
const loginBtn = document.getElementById('loginBtn')
const username = document.getElementById('username')
const password = document.getElementById('password')
const reportCount = document.getElementById('reportCount');
const reportRevenue = document.getElementById('reportRevenue');
const reportOcc = document.getElementById('reportOcc');
const searchUser = document.getElementById('searchUser');

// Fire on load & Event Listeners
onLoad(5);
selectDate.addEventListener('change', () => showAvailableRooms())
roomTypeSelector.addEventListener('change', () => advancedFilterRooms())
activeArea.addEventListener('click', () => popModal())
loginBtn.addEventListener('click', () => login())
loginBtn.addEventListener('keypress', () => {
  if (event.keyCode === 13) {
    return login();
  }
})