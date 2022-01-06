require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.static('build'))
app.use(express.json())

const cors = require('cors')
app.use(cors())


const Person = require('./models/person')

morgan.token('body', (req, res) => JSON.stringify(req.body));

/*
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
  */

  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

  app.get('/info', (req, res) => {
      
    const amount = Person.length
      const time = new Date()
      
    res.send(`Phonebook has info for ${amount} people ` 
    + time)
  })

  //Get a list of all the people
  app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
  })

  //Find a person
  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next (error))
  })

  /*
  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
  */

  //post a new person
  app.post('/api/persons', (request, response, next) => {
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
      .catch(error => next(error))
  })

  //Update a persons information
  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    console.log(request.params.id)
    console.log(request.body)
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person)
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

  //delete a person
  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  app.use(unknownEndpoint)

  //handle errors
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json(error.message)
    }
    next(error)
  }
  
  app.use(errorHandler)

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })