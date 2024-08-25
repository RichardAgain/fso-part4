
const _ = require('lodash')

const dummy = (blogs) => {
    return (Array.isArray(blogs)) ? 1 : 0
}

const totalLikes = (blogs) => {
    return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((greater, blog) => (blog.likes >= greater.likes) ? blog : greater)
}

const mostBlogs = (blogs) => {
    return (
        Object.entries(_.groupBy(blogs, 'author'))
        .map(entries => {
            const [ author, values] = entries

            const blogs = values.length 

            return {
                author, 
                blogs
            }
        })
        .reduce((greater, auth) => (auth.blogs >= greater.blogs) ? auth : greater)
    )
}

const mostLikes = (blogs) => {
    return (
        Object.entries(_.groupBy(blogs, 'author'))
        .map(entries => {
            const [ author, values] = entries

            const likes = 
            values.reduce((acc, value) => acc + value.likes, 0)

            return {
                author, 
                likes
            }
        })
        .reduce((greater, auth) => (auth.likes >= greater.likes) ? auth : greater)
    )
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}