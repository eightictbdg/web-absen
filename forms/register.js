const forms = require('forms');
const fields = forms.fields;
const validators = forms.validators;
 
var register_form = forms.create({
  name: fields.string({ required: validators.required('Please enter a name') }),
  class: fields.string({ required: validators.required('Please enter a class name') }),
  username: fields.string({ required: validators.required('Please enter a username') }),
  password: fields.password({ required: validators.required('Please enter a password') }),
  confirm:  fields.password({
        required: validators.required('Please confirm your password'),
        validators: [validators.matchField('password')]
    })
});

module.exports = register_form;