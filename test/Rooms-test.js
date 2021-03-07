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

  it('should be able to accurately filter rooms by their roomType property', () => {
    expect(testRooms.filterByRoomType('single room')).to.deep.equal([room3, room4])
    expect(testRooms.filterByRoomType('junior suite')).to.deep.equal([room2])
  })
})