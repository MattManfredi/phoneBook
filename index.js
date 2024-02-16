const express  = require ('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

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

let notes = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Get all persons
app.get('/api/persons', (req,res)=>{
    res.json(notes)
})

// Get info
app.get('/info', (req,res)=>{
    const date = new Date().toLocaleString();
    const persons = notes.length;
    res.send(`
    <h2>Phonebook has info for ${persons} people</h2>
    <p>${date}</p>
    `)
})

// Get by ID
app.get('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    const note = notes.find(note=> note.id === id)
    if(note) {
        res.json(note);
    }else{
        res.status(400).end()
    }
    
})

// Delete by ID
app.delete('/api/persons/:id', (req,res)=>{
    const id = Number(req.params.id)
    notes = notes.filter(note=> note.id !== id)
    res.status(204).end()
})

// ID generator
const generateId = ()=>{
    const maxId = notes.length > 0 
        ? Math.max(...notes.map(n=>n.id))
        : 0
    return maxId + 1
}

// Add person
app.post('/api/persons',(req,res)=>{
    const body = req.body
    if (!body.name){
        return res.status(400).json({error: 'name missing'})
    }
    if(notes.find(note=>note.name === body.name)){
        return res.status(406).json({error: 'name must be unique'})
    }

    const note = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }
    
    notes.push(note)
    res.json(note)
    
})

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server runing on port: ${PORT} 🔥🔥🔥`);
})