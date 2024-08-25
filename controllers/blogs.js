
const express = require('express')
const router = express.Router()

const Blog = require('../models/blog')

router.get('/', async (request, response) => {
  const blogs = await Blog.find({})

  response.json(blogs)
})

router.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  response.json(blog)
})

router.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const result = await blog.save()

  response.status(201).json(result)
})

router.patch('/:id', async (request, response) => {
  await Blog.findByIdAndUpdate
    (request.params.id, 
      {
        likes: request.body.likes
      }
    )

  return response.status(200).json({ message: 'Updated succesfully' })
})

router.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)

  response.status(204).json({message: 'Deleted succesfully'})
})

module.exports = router
