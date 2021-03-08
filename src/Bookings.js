export default class Bookings {
  constructor(allBookings) {
    this.bookings = allBookings
  }

  bookingsByDate (desiredDate) {
    return this.bookings.reduce((roomNums, booking) => {
      if (booking.date === desiredDate) {
        roomNums.push(booking.roomNumber);
      }
      return roomNums;
    }, []);
  }

  bookingsByUser (desiredUserID) {
    return this.bookings.filter(booking => booking.userID === desiredUserID)
  }
}