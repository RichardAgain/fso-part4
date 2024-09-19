const router = require("express").Router()
const bcrypt = require("bcrypt")

const User = require("../models/user")

router.post("/", async (req, res) => {
  const { username, password, name } = req.body

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    passwordHash,
    name,
  })

  await user.save()

  return res.status(201).json(user)
})

module.exports = router
