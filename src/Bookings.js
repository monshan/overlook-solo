export default class Bookings {
  constructor(allBookings) {
    this.bookings = allBookings
  }

  bookingsByDate (desiredDate) {
    return this.bookings.filter(booking => booking.date === desiredDate)
  }

  bookingsByUser (desiredUserID) {
    return this.bookings.filter(booking => booking.userID === desiredUserID)
  }
}