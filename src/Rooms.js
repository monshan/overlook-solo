export default class Rooms {
  constructor (allRooms) {
    this.rooms = allRooms
  }

  filterByRoomType (desiredType) {
    return this.rooms.filter(room => room.roomType === desiredType)
  }
}