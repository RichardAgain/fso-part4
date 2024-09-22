const { test, describe, beforeEach, before, after } = require("node:test")
const assert = require("node:assert")
const supertest = require("supertest")
const mongoose = require("mongoose")
const app = require("../app")

const api = supertest(app)

const Blog = require("../models/blog")
const { blogs, blogsInDb } = require("../utils/test_blogs")
const User = require("../models/user")

const testUser = {
  username: "danielcrack",
  password: "password",
  name: "Daniel",
}

beforeEach(async () => {
  const user = await User.findOne({ username: testUser.username })

  await Blog.deleteMany({})

  const promises = blogs.map((blog) =>
    new Blog({ ...blog, user: user.id }).save()
  )

  await Promise.all(promises)
})

describe("blog test", () => {
  test("response is in expected type", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("it retrieves the correct amount of blogs", async () => {
    const response = await api.get("/api/blogs")

    assert.strictEqual(response.body.length, blogs.length)
  })

  test("blogs contains the id property", async () => {
    const response = await api.get("/api/blogs")

    assert(!!response.body[0].id)
  })

  describe("Guarded actions with Auth", () => {
    let token = null

    before(async () => {
      const response = await api.post("/api/login").send(testUser)

      token = response.body.token
    })

    describe("saving a new blog", () => {
      const testBlog = {
        title: "Why Disney Pixar Cars is a cinematic masterpiece",
        author: "A Genius",
        url: "https://trust.me.bro.org/",
      }

      test("returns the correct amount of blogs", async () => {
        await api
          .post("/api/blogs")
          .set({ authorization: `Bearer ${token}` })
          .send(testBlog)
          .expect(201)
          .expect("Content-Type", /application\/json/)

        const updatedBlogs = await blogsInDb()

        assert.strictEqual(updatedBlogs.length, blogs.length + 1)
      })

      test("return body contains the new data", async () => {
        await api
          .post("/api/blogs")
          .set({ authorization: `Bearer ${token}` })
          .send(testBlog)

        const updatedBlogs = await blogsInDb()

        const contents = updatedBlogs.map((blog) => blog.title)
        assert(contents.includes(testBlog.title))
      })

      test("without likes defaults to zero", async () => {
        const response = await api
          .post("/api/blogs")
          .set({ authorization: `Bearer ${token}` })
          .send(testBlog)

        assert.strictEqual(response.body.likes, 0)
      })

      test("without title or url throws status error", async () => {
        const badBlog = {
          title: "",
          url: "",
          author: "You'll never catch me",
        }

        await api
          .post("/api/blogs")
          .set({ authorization: `Bearer ${token}` })
          .send(badBlog)
          .expect(400)
      })
    })

    describe("updating an existing blog", () => {
      test("updated blog returns the correct amount of likes", async () => {
        let updatedBlogs = await blogsInDb()
        const id = updatedBlogs[0].id

        const likeCount = 1000

        await api
          .patch(`/api/blogs/${id}`)
          .set({ authorization: `Bearer ${token}` })
          .send({ likes: likeCount })
          .expect(200)

        const updatedBlog = await Blog.findById(id)
        assert.strictEqual(updatedBlog.likes, likeCount)
      })
    })

    describe("deleting an existing blog", () => {
      test("return the expected amount of blogs", async () => {
        let updatedBlogs = await blogsInDb()
        const idToDelete = updatedBlogs[0].id

        await api
          .delete(`/api/blogs/${idToDelete}`)
          .set({ authorization: `Bearer ${token}` })
          .expect(204)

        updatedBlogs = await blogsInDb()

        assert.strictEqual(updatedBlogs.length, blogs.length - 1)
      })

      test("deleted the correct blog", async () => {
        let updatedBlogs = await blogsInDb()
        const idToDelete = updatedBlogs[0].id
        const titleToDelete = updatedBlogs[0].title

        await api
          .delete(`/api/blogs/${idToDelete}`)
          .set({ authorization: `Bearer ${token}` })
          .expect(204)

        updatedBlogs = await blogsInDb()
        const contents = updatedBlogs.map((blog) => blog.title)

        assert(!contents.includes(titleToDelete))
      })
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
