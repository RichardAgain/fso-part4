const { test, describe, beforeEach, after } = require("node:test")
const assert = require("node:assert")
const supertest = require("supertest")
const mongoose = require("mongoose")
const app = require("../app")

const api = supertest(app)

const Blog = require("../models/blog")
const { blogs, blogsInDb } = require("../utils/test_blogs")

beforeEach(async () => {
  await Blog.deleteMany({})

  const promises = blogs.map((blog) => new Blog(blog).save())

  await Promise.all(promises)
})

describe("api tests", () => {
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

  describe("saving a new blog", () => {
    const testBlog = {
      title: "Why Disney Pixar Cars is a cinematic masterpiece",
      author: "A Genius",
      url: "https://trust.me.bro.org/",
    }

    test("returns the correct amount of blogs", async () => {
      await api
        .post("/api/blogs")
        .send(testBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)

      const updatedBlogs = await blogsInDb()

      assert.strictEqual(updatedBlogs.length, blogs.length + 1)
    })

    test("return body contains the new data", async () => {
      await api.post("/api/blogs").send(testBlog)

      const updatedBlogs = await blogsInDb()

      const contents = updatedBlogs.map((blog) => blog.title)
      assert(contents.includes(testBlog.title))
    })

    test("without likes defaults to zero", async () => {
      const response = await api.post("/api/blogs").send(testBlog)

      assert.strictEqual(response.body.likes, 0)
    })

    test("without title or url throws status error", async () => {
      const badBlog = {
        title: "",
        url: "",
        author: "You'll never catch me",
      }

      await api.post("/api/blogs").send(badBlog).expect(400)
    })
  })

  describe("updating an existing blog", () => {
    test("updated blog returns the correct amount of likes", async () => {
      let updatedBlogs = await blogsInDb()
      const id = updatedBlogs[0].id

      const likeCount = 1000

      await api.patch(`/api/blogs/${id}`).send({ likes: likeCount }).expect(200)

      const updatedBlog = await Blog.findById(id)
      assert.strictEqual(updatedBlog.likes, likeCount)
    })
  })

  describe("deleting an existing blog", () => {
    test("return the expected amount of blogs", async () => {
      let updatedBlogs = await blogsInDb()
      const idToDelete = updatedBlogs[0].id

      await api.delete(`/api/blogs/${idToDelete}`).expect(204)

      updatedBlogs = await blogsInDb()

      assert.strictEqual(updatedBlogs.length, blogs.length - 1)
    })

    test("deleted the correct blog", async () => {
      let updatedBlogs = await blogsInDb()
      const idToDelete = updatedBlogs[0].id
      const titleToDelete = updatedBlogs[0].title

      await api.delete(`/api/blogs/${idToDelete}`).expect(204)

      updatedBlogs = await blogsInDb()
      const contents = updatedBlogs.map((blog) => blog.title)

      assert(!contents.includes(titleToDelete))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
