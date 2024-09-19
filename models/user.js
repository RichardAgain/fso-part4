const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: [3, 'too short stupid'],
    maxLength: [12, 'too long stupid'],
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    minLength: [3, 'too short stupid'],
    required: true,
  },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog'}]
})

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const User = mongoose.model("User", userSchema)

module.exports = User
