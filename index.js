const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token("data", (req, res) => { return req.method === "POST" ? JSON.stringify(req.body) : null });
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :data`));

let personData = [
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

app.get('/', (request, response) => {
    response.send('<h1>Welcome to root!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(personData)
})

app.get('/info', (request, response) => {
    const time = new Date()
    response.send(`<p>Phonebook has info for ${personData.length} people</p><p>${time}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = personData.find(person => person.id === id)
    console.log(person);
    person ? response.json(person) : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    personData = personData.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    console.log(`sent content-type: ${request.get('content-type')}`);
    
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(404).json({ 
            error: 'insert a proper name and number' 
        })
    } else if(personData.some(person => person.name === body.name)) {
        return response.status(404).json({
            error: 'name must be unique'
        })
    }

    const person = {
        "id": Math.floor(Math.random() * 10000),
        "name": body.name,
        "number": body.number
    }

    personData = personData.concat(person)

    response.json(person)
})

app.put('/api/persons/:id', (request, response) => {
    console.log('put started');
    const id = Number(request.params.id)
    const body = request.body
    const person = personData.find(person => person.id === id)
    console.log('body: ', body, 'person: ', person);
    if(!person) {
        return response.status(404).json({ 
            error: 'unable to find person' 
        })
    }

    const i = personData.indexOf(person)
    personData[i].number = body.number
    response.json(personData[i])
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})