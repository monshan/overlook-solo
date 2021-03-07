import chai from 'chai';
const expect = chai.expect;
import Bookings from '../src/Bookings'

describe('Bookings Class', () => {
  let booking1;
  let booking2;
  let booking3;
  let booking4;
  let testBookings;

  beforeEach(() => {
    booking1 = {
      "id": "5fwrgu4i7k55hl6u0",
      "userID": 32,
      "date": "2020/02/18",
      "roomNumber": 33,
      "roomServiceCharges": []
    }
    booking2 = {
      "id": "5fwrgu4i7k55hl75a",
      "userID": 32,
      "date": "2020/02/17",
      "roomNumber": 34,
      "roomServiceCharges": []
    }
    booking3 = {
      "id": "5fwrgu4i7k55hl75j",
      "userID": 71,
      "date": "2020/02/18",
      "roomNumber": 31,
      "roomServiceCharges": []
    }
    booking4 = {
      "id": "5fwrgu4i7k55hl76u",
      "userID": 71,
      "date": "2020/02/17",
      "roomNumber": 32,
      "roomServiceCharges": []
    }
    testBookings = new Bookings ([booking1, booking2, booking3, booking4])
  })

  it('should be a function', () => {
    expect(Bookings).to.be.a('function');
  })

  it('should be an instance of the Bookings Class', () => {
    expect(testBookings).to.be.an.instanceOf(Bookings)
  })

  it('should store a collection of all bookings as an array', () => {
    expect(testBookings.bookings).to.be.an('array')
  })

  it('can accurately determine the rooms booked for a single date', () => {
    expect(testBookings.bookingsByDate('2020/02/18')).to.deep.equal([booking1, booking3])
    expect(testBookings.bookingsByDate('2020/02/17')).to.deep.equal([booking2, booking4])
  })

  it('can accurately determine the bookings of a specific user', () => {
    expect(testBookings.bookingsByUser(32)).to.deep.equal([booking1, booking2])
    expect(testBookings.bookingsByUser(71)).to.deep.equal([booking3, booking4])
  })
})