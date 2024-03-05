require('dotenv').config()
const express  = require ('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const Phone = require('./models/phone')
const { restart } = require('nodemon')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('data', function(req,res) {
    if (req.method === 'POST'){
        // const name = req.body.name || '-';
        // const number = req.body.number || '-';
        // return name + ' ' + number
        const data = JSON.stringify(req.body)
        return data
    }
    return '-';
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))



// Get all persons
app.get('/api/persons', (req,res)=>{
    Phone.find({}).then(phones =>{
        res.json(phones)
    })
})

// Get info
app.get('/info', (req,res,next)=>{
    Phone.find({})
        .then(phones=>{
            const date = new Date().toLocaleString();
            const persons = phones.length
            console.log('Persons: ',persons);
            res.send(`
            <h2>Phonebook has info for ${persons} people</h2>
            <p>${date}</p>
            `)
        })
        .catch(error=> next(error))    
})

// Get by ID
app.get('/api/persons/:id',(req,res)=>{
    Phone.findById(req.params.id).then(note=>{
        res.json(note)
    })    
})

// Delete by ID
app.delete('/api/persons/:id', (req,res,next)=>{
    Phone.findByIdAndDelete(req.params.id)
        .then(result=>{
            res.status(204).end()
        })
        .catch(error=> next(error))
})


// Add person
app.post('/api/persons',(req,res,next)=>{
    const body = req.body
    Phone.findOne({name: body.name})
        .then(existingPhone=>{
            if(existingPhone){
                return res.status(406).json({error: 'name must be unique'})
            }
            const phone = new Phone({
                name: body.name,
                number: body.number,
            })
            return phone.save()
        })
        .then(savedPhone=>{
            res.json(savedPhone)
        })
        .catch(error=>next(error))   
})

// Modify person
app.put('/api/persons/:id',(req,res,next)=>{
    const {name,number} = req.body
    Phone.findByIdAndUpdate(
        req.params.id,
        {name,number},
        {new: true, runValidators: true, context: 'query'}
       )
    .then(updatedNote=> res.json(updatedNote))
    .catch(error=> next(error))
})

// Definicion del puerto
const PORT = process.env.PORT 
app.listen(PORT, ()=>{
    console.log(`Server runing on port: ${PORT} 🔥🔥🔥`);
})

// Manejo de rutas no admititdas
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Manejo de errores
const errorHandler = (error, req, res, next)=>{
    console.log('error:', error);
    if(error.name === 'CastError'){
        return res.status(400).send({error: 'Malformated ID'})
    }else if(error.name === 'ValidationError'){
        return res.status(400).json({error: error.message})
    }
    next(error)
}
app.use(errorHandler)



