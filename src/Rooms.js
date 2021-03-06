export default class Rooms {
  constructor (allRooms) {
    this.rooms = allRooms
  }

  filterByRoomType (desiredType) {
    return this.rooms.filter(room => room.roomType === desiredType)
  }

  filterByAva (roomsFilled) {
    return this.rooms.filter(room => !roomsFilled.includes(room.number))
  }

  findRoom (roomNumber) {
    return this.rooms.find(room => room.number === roomNumber)
  }

  calcHistoricalSpending (listOfRoomNumbers) {
    return listOfRoomNumbers.reduce((total, roomNum) => {
      total += parseFloat(this.rooms.find(room => room.number === roomNum).costPerNight);
      return total;
    }, 0)
  }

  calcCapacity (roomsFilled) {
    return parseInt((roomsFilled.length / this.rooms.length) * 100)
  }
}