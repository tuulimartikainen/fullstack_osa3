require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())
app.use(express.static('build'))

const Person = require('./models/person')

morgan.token('body', (req, res) => JSON.stringify(req.body));

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }

  ]

  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

  app.get('/info', (req, res) => {
      const amount = persons.length
      const time = new Date()
      
    res.send(`Phonebook has info for ${amount} people` + time)
  })

  app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
  })

  app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
  })

  /*
  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
  */

  app.post('/api/persons', (request, response) => {
        const body = request.body
        console.log(body)

  
    if (body.name === undefined) {
        return response.status(400).json({ 
          error: 'name is missing' 
        })
      } else if (body.number === undefined) {
        return response.status(400).json({ 
          error: 'number is missing' 
        })
      }
    
      const person = new Person ({
        name: body.name,
        number: body.number        
      })
    
      person.save().then(savedPerson => {
        response.json(savedPerson)
      })    
    
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })