import chai from 'chai';
const expect = chai.expect;
import Rooms from '../src/Rooms'

describe('Rooms Class', () => {
  let room1;
  let room2;
  let room3;
  let room4;
  let testRooms;

  beforeEach(() => {
    room1 = {
      "number": 31,
      "roomType": 'residential suite',
      "bidet": true,
      "bedSize": 'king',
      "numBeds": 1,
      "costPerNight": 385.5
    };
    room2 = {
      "number": 32,
      "roomType": 'junior suite',
      "bidet": true,
      "bedSize": 'queen',
      "numBeds": 1,
      "costPerNight": 345.5
    }
    room3 = {
      "number": 33,
      "roomType": 'single room',
      "bidet": false,
      "bedSize": 'twin',
      "numBeds": 1,
      "costPerNight": 310
    }
    room4 = {
      "number": 34,
      "roomType": 'single room',
      "bidet": false,
      "bedSize": 'full',
      "numBeds": 1,
      "costPerNight": 325.75
    }
    testRooms = new Rooms ([room1, room2, room3, room4])
  })

  it('should be a function', () => {
    expect(Rooms).to.be.a('function')
  })

  it('should be an instance of the Rooms Class', () => {
    expect(testRooms).to.be.an.instanceOf(Rooms)
  })

  it('should store a collection of all rooms as an array', () => {
    expect(testRooms.rooms).to.be.an('array')
  })

  it('can accurately filter rooms by their roomType property', () => {
    expect(testRooms.filterByRoomType('single room')).to.deep.equal([room3, room4])
    expect(testRooms.filterByRoomType('junior suite')).to.deep.equal([room2])
  })

  it('can accurately filter available rooms given the room numbers filled', () => {
    expect(testRooms.filterByAva([31])).to.deep.equal([room2, room3, room4])
    expect(testRooms.filterByAva([room2.number, room3.number])).to.deep.equal([room1, room4])
  })

  it('can return a room given a room number', () => {
    expect(testRooms.findRoom(32)).to.deep.equal(room2);
    expect(testRooms.findRoom(34)).to.deep.equal(room4);
  })

  it('can accurately calculate total amount spent on all bookings listed as an array of room numbers', () => {
    expect(testRooms.calcHistoricalSpending([31, 34])).to.deep.equal(711.25)
    expect(testRooms.calcHistoricalSpending([33, 32])).to.deep.equal(655.5)
    expect(testRooms.calcHistoricalSpending([32, 32])).to.deep.equal(691)
  })

  it('can accurately calculate the percent capacity given the room numbers filled', () => {
    expect(testRooms.calcCapacity([31])).to.deep.equal(25)
    expect(testRooms.calcCapacity([31, 32, 33])).to.deep.equal(75)
    testRooms.rooms = [31, 32, 33]
    expect(testRooms.calcCapacity([31])).to.deep.equal(33)
  })
})