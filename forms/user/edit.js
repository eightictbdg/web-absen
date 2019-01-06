const forms = require('forms');
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;
 
module.exports = function() {
  return forms.create({
    name: fields.string({
      label: 'Name: ',
      hideError: true,
      inputOnly: true,
      required: validators.required('Please enter a name') 
    }),
    username: fields.string({
      label: 'Username: ',
      hideError: true,
      inputOnly: true,
      required: validators.required('Please enter a username') 
    }),
    class: fields.string({
      label: 'Class: ',
      hideError: true,
      inputOnly: true,
      required: validators.required('Please enter a class name') 
    }),
    division: fields.string({
      widget: widgets.select(
        {
          classes: ['form-control','form-control-sm','dropdown']
        }
      ),
      label: ' Division: ',
      hideError: true,
      inputOnly: true
    }),
    role: fields.string({
      widget: widgets.select(
        {
          classes: ['form-control','form-control-sm','dropdown']
        }
      ),
      label: ' Role: ',
      hideError: true,
      inputOnly: true
    }),
    password: fields.password({
      label: 'Password: ',
      hideError: true,
      inputOnly: true
    })
  });
}