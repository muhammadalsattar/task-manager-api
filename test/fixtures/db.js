const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/Task')


const _id = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()
const userOne = new User({
    _id,
    name: 'Test',
    email: 'test@test.com',
    password: 'test123',
    tokens: [{ token: jwt.sign({ _id }, process.env.JWT_SECRET_KEY)}]
})
const userTwo = new User({
    _id: userTwoId,
    name: 'User Two',
    email: 'usertwo@test.com',
    password: 'test123',
    tokens: [{ token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET_KEY)}]
})
const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    name: 'First Task',
    completed: false,
    owner: userOne._id
}
const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Second Task',
    completed: false,
    owner: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
}

module.exports = {
    userOne,
    userTwo,
    taskTwo,
    setupDatabase
}
