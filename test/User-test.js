import chai from 'chai';
const expect = chai.expect;
import User from '../src/User'

describe('User Class', () => {
  let user1;
  let user2;
  let booking1;
  let booking2;
  let booking3;
  let booking4;

  beforeEach(() => {
    user1 = new User ({
      "id": 32,
      "name": "Reiner Braun"
    })
    user2 = new User ({
      "id": 71,
      "name": "Eren Yaeger"
    })
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
  })

  it('should be a function', () => {
    expect(User).to.be.a('function')
  })

  it('should be an instance of the User Class', () => {
    expect(user1).to.be.an.instanceOf(User)
  })

  it('should accurately store an id', () => {
    expect(user2.id).to.deep.equal(71)
    expect(user1.id).to.deep.equal(32)
    user1.id = 42
    expect(user1.id).to.deep.equal(42)
  })

  it('should accurately store a name', () => {
    expect(user1.name).to.deep.equal('Reiner Braun')
    expect(user2.name).to.deep.equal('Eren Yaeger')
    user2.name = "Annie Leonhart"
    expect(user2.name).to.deep.equal('Annie Leonhart')
  })

  it('should be able to store associated bookings with a default of an empty array', () => {
    expect(user1.bookingsRecord).to.deep.equal([])
    expect(user2.bookingsRecord).to.be.an('array')
  })

  it('can add bookings to the bookingsRecord property', () => {
    user1.addToBookingsRecord(booking1);
    expect(user1.bookingsRecord).to.deep.equal([booking1]);
  })

  it('will not add bookings that do not belong to the user', () => {
    user1.addToBookingsRecord(booking3);
    expect(user1.bookingsRecord).to.deep.equal([]);
  })

  it('can accurately determine all booking room numbers', () => {
    user1.addToBookingsRecord(booking1);
    user1.addToBookingsRecord(booking2);
    expect(user1.billingRoomNumbers()).to.deep.equal([33, 34])

    user2.addToBookingsRecord(booking1);
    user2.addToBookingsRecord(booking3);
    expect(user2.billingRoomNumbers()).to.deep.equal([31])
  })
})