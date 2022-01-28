const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  user_id:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users'
  }
})

authorSchema.pre('remove', function(next) {
  Book.find({ author: this.id }, (err, books) => {
    if (err) {
      next(err)
    } else if (books.length > 0) {
      books.forEach(b=>{
       b.remove();
      })
      next()
    } else {
      next()
    }
  })
})

 module.exports = mongoose.model('Author', authorSchema)