export default {
  dbURL: process.env.MONGO_URL || 'mongodb+srv://elior:elior123@cluster0.abmony7.mongodb.net/?retryWrites=true&w=majority',
  dbName: process.env.DB_NAME || 'story_db'
}

