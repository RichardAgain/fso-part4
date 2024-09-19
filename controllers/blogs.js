const express = require("express")
const router = express.Router()

const { getRequestUser } = require("../middleware/authMiddleware")

const Blog = require("../models/blog")

router.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", ["username", "name"])

  response.json(blogs)
})

router.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", [
    "username",
    "name",
  ])

  if (!blog) return response.status(404).json()

  response.json(blog)
})

router.use(getRequestUser)

router.post("/", async (request, response) => {
  const blog = new Blog({
    ...request.body,
    user: request.user.id,
  })

  const result = await blog.save()

  response.status(201).json({ result })
})

router.patch("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog.user.toString() === request.user.id) {
    return response
      .status(201)
      .json({ message: "Not authorized to make this request" })
  }

  await blog.updateOne({
    likes: request.body.likes,
  })

  return response.status(200).json({ message: "Updated succesfully" })
})

router.delete("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog.user.toString() === request.user.id) {
    return response
      .status(201)
      .json({ message: "Not authorized to make this request" })
  }

  await blog.deleteOne()

  response.status(204).json()
})

module.exports = router
