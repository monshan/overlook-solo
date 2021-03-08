export default class User {
  constructor (newUser) {
    this.id = newUser.id,
    this.name = newUser.name,
    this.bookingsRecord = []
  }

  addToBookingsRecord (newBooking) {
    if (newBooking.userID === this.id) {
      this.bookingsRecord.push(newBooking);
    }
  }

  billingRoomNumbers () {
    return this.bookingsRecord.map(booking => booking.roomNumber);
  }

  sortBookings () {
    this.bookingsRecord.sort((a, b) => {
      a = a.date.split('/')
      b = b.date.split('/')
      return b[0] - a[0] || b[1] - a[1] || b[2] - a[2];
    })
  }
}