const { test, describe, before, beforeEach, after } = require("node:test")
const assert = require("node:assert")
const supertest = require("supertest")
const mongoose = require("mongoose")
const app = require("../app")
const User = require("../models/user")
const Blog = require("../models/blog")

const api = supertest(app)

const testUser = {
  username: "danielcrack",
  password: "password",
  name: "Daniel",
}

before(async () => {
  await User.deleteMany()
})

describe("user tests", () => {
  test("saving a new user", async () => {
    const response = await api.post("/api/users").send(testUser).expect(201)

    const user = await User.findOne({ username: testUser.username })

    assert.strictEqual(user.username, testUser.username)
  })

  test("usernames must be 3 chars min and 12 chars max", async () => {
    await api
      .post("/api/users")
      .send({
        ...testUser,
        username: "hi",
      })
      .expect(400)

    await api
      .post("/api/users")
      .send({
        ...testUser,
        username: "thisusernameistoolongsodontuseit",
      })
      .expect(400)
  })

  describe("user login and auth", () => {
    test("user can login", async () => {
      const response = await api.post("/api/login").send(testUser).expect(200)
    })

    test("cant login with wrong or w/o password", async () => {
      const toLogin = testUser
      toLogin.password = "wrong!!!"

      await api.post("/api/login").send(testUser).expect(401)

      delete toLogin.password

      await api.post("/api/login").send(testUser).expect(400)
    })
  })
})

after(async () => {
  const user = new User({
    username: "testUser",
    passwordHash: "yeah",
    name: "this is a test user!",
  })

  await user.save()

  await mongoose.connection.close()
})
