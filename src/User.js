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
}