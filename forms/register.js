const forms = require('forms');
const fields = forms.fields;
const validators = forms.validators;
 
var register_form = forms.create({
  name: fields.string({
    label: 'Name: ',
    required: validators.required('Please enter a name') 
  }),
  class: fields.string({
    label: 'Class: ',
    required: validators.required('Please enter a class name') 
  }),
  username: fields.string({
    label: 'Username: ',
    required: validators.required('Please enter a username') 
  }),
  password: fields.password({
    label: 'Password: ',
    required: validators.required('Please enter a password') 
  }),
  confirm_password:  fields.password({
    label: 'Confirm Password: ',
    required: validators.required('Please confirm your password'),
    validators: [validators.matchField('password')]
  })
});

module.exports = register_form;