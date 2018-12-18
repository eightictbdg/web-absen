const forms = require('forms');
const fields = forms.fields;
const validators = forms.validators;
 
module.exports = function() {
  return forms.create({
    name: fields.string({
      label: 'Name: ',
      hideError: true,
      inputOnly: true,
      required: validators.required('Please enter a name') 
    }),
    class: fields.string({
      label: 'Class: ',
      hideError: true,
      inputOnly: true,
      required: validators.required('Please enter a class name') 
    }),
    username: fields.string({
      label: 'Username: ',
      hideError: true,
      inputOnly: true,
      required: validators.required('Please enter a username') 
    }),
    password: fields.password({
      label: 'Password: ',
      hideError: true,
      inputOnly: true,
      required: validators.required('Please enter a password') 
    })
  });
}