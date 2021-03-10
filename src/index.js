// Imports
import Swal from 'sweetalert2'
import './css/base.scss';
import User from './User'
import Rooms from './Rooms'
import Bookings from './Bookings'

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

const getAllUsers = () => {
  return fetch('http://localhost:3001/api/v1/customers/')
    .then(response => response.json())
}

const getSingleUser = (loginID) => {
  return fetch('http://localhost:3001/api/v1/customers/' + loginID)
    .then(response => response.json())
}

const hide = (desiredElement) => {
  desiredElement.classList.add('hidden')
}

const unHide = (desiredElement) => {
  desiredElement.classList.remove('hidden')
}

const customerLoad = (userID) => {
  return Promise.all([getRooms(), getBookings(), getSingleUser(userID)])
    .then(([loadedRooms, loadedBookings, loadedUser]) => {
      const roomsRepo = new Rooms (loadedRooms.rooms);
      const bookingsRepo = new Bookings (loadedBookings.bookings);
      const activeUser = new User (loadedUser);
      bookingsRepo.bookingsByUser(activeUser.id).forEach(entry => {
        return activeUser.addToBookingsRecord(entry);
      })
      activeUser.sortBookings();
      assignGlobals(roomsRepo, bookingsRepo, activeUser);
      populateUserAside(activeUser);
    })
    .catch(err => console.log(err))
}

const managerLoad = () => {
  Promise.all([getRooms(), getBookings(), getAllUsers()])
    .then(([loadedRooms, loadedBookings, loadedUsers]) => {
      const roomsRepo = new Rooms (loadedRooms.rooms);
      const bookingsRepo = new Bookings (loadedBookings.bookings);
      const usersRepo = [];
      loadedUsers.customers.forEach(user => {
        const newU = new User (user)
        usersRepo.push(newU)
      })
      usersRepo.forEach(user => {
        bookingsRepo.bookingsByUser(user.id).forEach(entry => {
          return user.addToBookingsRecord(entry);
        })
        user.sortBookings();
      })
      managerGlobals(roomsRepo, bookingsRepo, usersRepo)
    })
    .catch(err => console.log(err))
}

const assignGlobals = (rooms, bookings, user) => {
  globalRooms = rooms;
  globalBookings = bookings;
  currentUser = user;
}

const managerGlobals = (rooms, bookings, users) => {
  globalRooms = rooms;
  globalBookings = bookings;
  globalUsers = users;
}

const populateUserAside = (desiredUser) => {
  const billing = globalRooms.calcHistoricalSpending(desiredUser.billingRoomNumbers())
  setSpendingMessage(billing)
  populateBookings(desiredUser.bookingsRecord, userBookings)
}

const populateManagerAside = (desiredUser) => {
  const billing = globalRooms.calcHistoricalSpending(desiredUser.billingRoomNumbers())
  managerSpending.innerText = `$${billing.toFixed(2)}`
  populateBookings(desiredUser.bookingsRecord, managerBookings)
}


const setSpendingMessage = (amt) => {
  spendingMess.innerHTML = `You've spent <span class="aside__p__span">$${amt.toFixed(2)}</span> on all bookings with Overlook, thank you for choosing us!`
}

const populateBookings = (desiredBookings, location) => {
  location.innerHTML = '';
  desiredBookings.forEach(book => {
    location.innerHTML += `<section class="booking-card">
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
  });
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
  determineReport(filled, openRooms);
  if (openRooms.length) {
    populateRooms(openRooms);
  } else {
    fireApology();
  }
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
    unHide(dateReport);
    unHide(userSearch);
    hide(roomSearch);
    hide(loginPage);
  } else if (password.value === 'overlook2021') {
    toUserDash(cutID(username.value));
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
  customerLoad(loginID);
}

const toManagerDash = () => {
  managerLoad();
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
    .then(result => {
      currentUser.bookingsRecord.unshift(result.newBooking);
      populateUserAside(currentUser);
    })
    .catch(error => console.log(error))
}

const popModal = () => {
  let domID = event.target.closest('button').parentNode.id;
  let selectedRoom = globalRooms.rooms.find(room => room.number === parseInt(domID));
  let selectedDate = grabDate();
  const newBooking = {
    "userID": currentUser.id,
    "date": selectedDate,
    "roomNumber": selectedRoom.number
  };
  Swal.fire({
    title: 'Please confirm your booking information',
    html: `Date: ${selectedDate}<br> Room Number: ${selectedRoom.number}<br> User: ${currentUser.name}`,
    icon: 'info',
    showCancelButton: true,
    footer: 'Overlook Hotel Bookings'
  })
    .then(result => {
    if (result.isConfirmed) {
      postNewBooking(newBooking);
      Swal.fire({
        title: 'See you then!',
        icon: 'success',
        text: `Your booking on ${selectedDate} is confirmed!`,
        footer: 'Overlook Hotel Bookings'
      })
    }
    })
}

const matchUserQuery = () => {
  const query = searchUser.value.toLowerCase()
  const matches = globalUsers.filter(user => {
    if (user.name.toLowerCase().includes(query)) {
      return true;
    } else {
      return false;
    }
  });
  populateUsers(matches);
}

const populateUsers = (matchedUsers) => {
  searchUserResults.innerHTML = '';
  matchedUsers.forEach(match => {
    searchUserResults.innerHTML += `<section class="user-card" id="user${match.id}">
    <h3>${match.name}</h3>
    <p>ID: ${match.id}</p>
    <button>See details</button>
  </section>`
  })
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
const searchUserResults = document.getElementById('searchUserResults');
const managerBookings = document.getElementById('managerViewBookings');
const managerSpending = document.getElementById('managerViewSpeding');
const managerName = document.getElementById('managerViewName');
const dateReport = document.getElementById('dateReport');
const userSearch = document.getElementById('userSearch');
const roomSearch = document.getElementById('roomSearch')

// Fire on load & Event Listeners
customerLoad(5);
selectDate.addEventListener('change', () => showAvailableRooms())
roomTypeSelector.addEventListener('change', () => advancedFilterRooms())
searchUser.addEventListener('keyup', () => matchUserQuery())
activeArea.addEventListener('click', () => popModal())
// searchUserResults.addEventListener('click', () => managerSelect())
loginBtn.addEventListener('click', () => login())
loginBtn.addEventListener('keypress', () => {
  if (event.keyCode === 13) {
    return login();
  }
})