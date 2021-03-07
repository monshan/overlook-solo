import chai from 'chai';
const expect = chai.expect;
import User from '../src/User'

describe('User Class', () => {
  let user1;
  let user2;

  beforeEach(() => {
    user1 = new User ({
      "id": 32,
      "name": "Reiner Braun"
    })
    user2 = new User ({
      "id": 71,
      "name": "Eren Yaeger"
    })
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
})