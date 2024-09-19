const router = require("express").Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require("../models/user")

router.post("/", async (req, res) => {
  const { username, password } = req.body

  if (!password) return res.status(400).json({ message: "Password required" })

  const user = await User.findOne({ username }).populate('blogs', ['url', 'title', 'likes'])
  if (!user) return res.status(401).json({ message: "Username not valid" })

  const match = await bcrypt.compare(password, user.passwordHash)
  if (!match) return res.status(401).json({ message: "Password not valid" })


  const token = jwt.sign({
    id: user.id
  }, process.env.SECRET_KEY, { expiresIn: 60*10 })

  return res.status(200).json({ message: "Login successful", token })
})

module.exports = router
