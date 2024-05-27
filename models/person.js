const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function(val) {
                return /\d{2,3}-\d{7,}/.test(val)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'Phone number is required field']
    }
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Person', personSchema);