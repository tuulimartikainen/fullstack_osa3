const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    id: String,
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length<3) {
  console.log('give password as argument')
} else if (process.argv.length === 3) {
    console.log('Phonebook:')
    const password = process.argv[2]
    const url =
        `mongodb+srv://fullstack:${password}@cluster0.nwr5c.mongodb.net/phonebook?retryWrites=true`

    mongoose.connect(url)

    Person
        .find({})
        .then(persons => {
            persons.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
        mongoose.connection.close()
    })
} else {
    const password = process.argv[2]
    const name = process.argv[3]
    const number = process.argv[4]

    //console.log(number)

    const url =
        `mongodb+srv://fullstack:${password}@cluster0.nwr5c.mongodb.net/phonebook?retryWrites=true`

    mongoose.connect(url)
    
    const person = new Person({
        name: name,
        number: number
      })
      
    person.save().then(response => {
        console.log('person saved!')
        mongoose.connection.close()
      })

}




