const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

const DB_NAME = process.env.NODE_ENV === 'test'
    ? process.env.TEST_DB_NAME
    : process.env.DB_NAME

module.exports = {
    PORT, 
    MONGODB_URI,
    DB_NAME
}
