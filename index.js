const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
app = express();

app.use(express.json());
app.use(cors());

morgan.token('body', (request, response) =>  request.method === 'POST' ? JSON.stringify(request.body) : '' )
app.use(morgan(':method :url: :status :res[content-length] :response-time ms - :body'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-1234567"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234245"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6323122"
    }
];

app.get('/', (request, response) => {
    response.send('<h1>Phonebook.</h1>');
});

app.get('/api/persons', (request, response) => {
    response.json(persons)
});

app.get('/info', (request,response) => {

    response.send(
        `<div>
            <p>Phonebook has ${persons.length} people in it</p>
            <p>${Date()}</p>
        </div>`
    );
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    console.log(`Deleting person with id ${id}`)
    persons = persons.filter(p => p.id !== id);

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: "Name missing"
        });
    } else if (!body.number) {
        return response.status(400).json({
            error: "number missing"
        });
    } else if (persons.map(p => p.name.toLowerCase()).includes(body.name.toLowerCase())) {
        return response.status(400).json({
            error: "name must be unique"
        });
    };

    const person = {
        id: Math.floor(Math.random() * (10000 - 0 + 1) ) + 0,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person);
    response.json(person);
})

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
};

app.use(requestLogger);

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT);