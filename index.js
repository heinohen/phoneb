require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');


app = express();
app.use(express.json());
app.use(express.static('dist'));
app.use(cors());

morgan.token('body', (request, response) =>  request.method === 'POST' ? JSON.stringify(request.body) : '' );
app.use(morgan(':method :url: :status :res[content-length] :response-time ms - :body'));


// get all -- done
app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons)
        });
});

app.get('/info', (request,response) => {
    response.send(
        `<div>
            <p>Phonebook has ${persons.length} people in it</p>
            <p>${Date()}</p>
        </div>`
    );
});

// get one -- done
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(p => {
            if (p) {
                response.json(p);
            } else {
                response.status(404).end();
            };
        })
        .catch(error => next(error));
});


// delete one -- done
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

// add one -- done
app.post('/api/persons', (request, response, next) => {
    const body = request.body;

    const person = new Person({
        name: body.name,
        number: body.number
    });
    
    person.save()
        .then(savedPerson => {
            response.json(savedPerson);
        })
        .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number
    };

    Person.findByIdAndUpdate(request.params.id, person)
        .then(updatedPerson => {
            response.json(updatedPerson);
        })
        .catch(error => next(error));
});

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

const errorHandler = (error, request, response, next) => {

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name = 'ValidationError') {
        return response.status(400).json({ error: error.message });
    };

    next(error);
};

app.use(errorHandler); // must be last

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
