const { connect } = require("mongoose");

connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then((conn) => console.log(`MongoDB connected: ${conn.connection.host}`))
  .catch((err) => console.error(`Error: ${err.message}`));
