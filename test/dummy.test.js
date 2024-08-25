
const { test, describe } = require('node:test')
const assert = require('node:assert')
const { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes } = require('../utils/list_helper')

const { blogs, listWithOneBlog } = require('../utils/test_blogs')

test('dummy returns one', () => {
  const blogs = []

  const result = dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {

  test('of empty list is zero', () => {
    assert.strictEqual(totalLikes([]), 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    assert.strictEqual(totalLikes(listWithOneBlog), 5)
  })

  test('of a bigger list is calculated right', () => {
    assert.strictEqual(totalLikes(blogs), 36)
  })
})

describe('favorite blog', () => {
  test('returns the most liked blog ', () => {
    assert.deepStrictEqual(favoriteBlog(blogs), blogs[2])
  })
})

describe('favorite author', () => {
  test('returns the right author with blog count', () => {
    const author = {
      author: "Robert C. Martin",
      blogs: 3
    }

    assert.deepStrictEqual(mostBlogs(blogs), author)
  })

  test('returns the right author with like count', () => {
    const author = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }

    assert.deepStrictEqual(mostLikes(blogs), author)
  })
})
