const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOne, taskTwo, setupDatabase } = require('./fixtures/db')


beforeEach(setupDatabase)

test('Should create new task', async()=>{
    const response = await request(app).post('/tasks').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send({
        name: "Test Task"
    }).expect(201)
    expect(response.body.name).toBe("Test Task")
    expect(response.body.completed).toBe(false)
})

test('Should get user one tasks', async()=>{
    const response = await request(app).get('/tasks').set('Authorization', `Bearer ${userOne.tokens[0].token}`).expect(200)
    expect(response.body.length).toBe(1)
})

test('Should fail to delete other user tasks', async()=>{
    const response = await request(app).delete(`/tasks/${taskTwo._id}`).set('Authorization', `Bearer ${userOne.tokens[0].token}`).send().expect(404)
    const task = await Task.findById(taskTwo._id)
    expect(task).not.toBeNull()
})