export default class Rooms {
  constructor (allRooms) {
    this.rooms = allRooms
  }

  filterByRoomType (desiredType) {
    return this.rooms.filter(room => room.roomType === desiredType)
  }

  calcHistoricalSpending (listOfRoomNumbers) {
    return listOfRoomNumbers.reduce((total, roomNum) => {
      total += parseFloat(this.rooms.find(room => room.number === roomNum).costPerNight);
      return total;
    }, 0)
  }
}