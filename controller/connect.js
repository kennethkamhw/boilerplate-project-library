const mongoose = require("mongoose");

// mongoose connection
const db = mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log('Database connected successfully!');
});

exports.db = db;