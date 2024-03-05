const mongoose = require('mongoose')

const password = process.argv[2]
const phoneName = process.argv[3]
const phoneNumber = process.argv[4]

const url = `mongodb+srv://matt:${password}@fullstackopen.5zswlex.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const phoneNumberSchema = new mongoose.Schema({
  name: String,
  number: Number
})

const Phone = mongoose.model('Phone', phoneNumberSchema)

const phone = new Phone({
  name: phoneName,
  number: phoneNumber
})

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}else if(process.argv.length===3){
  Phone.find({}).then(result=> {
    result.forEach(phone => {
      console.log(phone);
    })
    mongoose.connection.close()
  })
}else{
  phone.save().then(result=>{
    console.log(`added ${phoneName} ${phoneNumber} to phonebook`);
    mongoose.connection.close()
  })  
}








