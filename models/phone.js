const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(result => console.log('Connected to database 👌'))
    .catch(error => console.log('Error connecting to MongoDB 😢',error.message))

const phoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    number: {
        type: String,
        required: true,
        minLength: 8,
        validate: {
            validator: function(v){
                return /^\d{2,3}-\d+$/.test(v)
            },
            message: "({VALUE}) is incorrect. Phone format must be [2,3] - [Rest of number] "
        }
    },
  })
  
phoneSchema.set('toJSON',{
    transform: (document, retunedObject) =>{
        retunedObject.id = retunedObject._id.toString()
        delete retunedObject._id
        delete retunedObject.__v
    }
})
  
module.exports = mongoose.model('Phone', phoneSchema)