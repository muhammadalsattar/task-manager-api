const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOne, setupDatabase } = require('./fixtures/db')


beforeEach(setupDatabase)

test('should fail to login non-existing user', async()=>{
    await request(app).post('/users/login').send({
        email: "fake@user.com",
        password: "fakepassword"
    }).expect(404)
})

test('should login existing user', async()=>{
    const response = await request(app).post('/users/login').send({
        email: "test@test.com",
        password: "test123"
    })
    const user = await User.findById(userOne._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should upload user avatar', async()=>{
    await request(app).post('/users/me/avatar').set('Authorization', `Bearer ${userOne.tokens[0].token}`).attach('avatar', 'test/fixtures/profile-pic.jpg').expect(200)
    const user = await User.findById(userOne._id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update authenticated user', async()=>{
    const response = await request(app).patch('/users/me').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send({
        name: "Test User"
    }).expect(200)
    expect(response.body.name).toBe("Test User")
})

test('Should fail to update unauthenticated user', async()=>{
    const response = await request(app).patch('/users/me').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send({
        Address: "Fake Address"
    }).expect(400)
})

test('Should logout authorized user', async()=>{
    await request(app).post('/users/logout').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send().expect(200)
})

test('Should fail to logout authorized user', async()=>{
    await request(app).post('/users/logout').send().expect(403)
})

test('Should delete user', async()=>{
    const response = await request(app).delete('/users/me').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send()
    const deletedUser = await User.findById(response.body._id)
    expect(deletedUser).toBeNull();
})