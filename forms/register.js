const forms = require('forms');
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;
 
var register_form = forms.create({
  division: fields.string({
    inputOnly: true,
    widget: widgets.select(
      {
        classes: ['form-control','form-control-sm','dropdown']
      }
    ),
    label: ' Division'
  }),
  role: fields.string({
    inputOnly: true,
    widget: widgets.select(
      {
        classes: ['form-control','form-control-sm','dropdown']
      }
    ),
    label: ' Role'
  }),
  name: fields.string({
    inputOnly: true,
    label: 'Name',
    required: validators.required('Please enter a name') 
  }),
  class: fields.string({
    inputOnly: true,
    label: 'Class',
    required: validators.required('Please enter a class name') 
  }),
  username: fields.string({
    inputOnly: true,
    label: 'Username',
    required: validators.required('Please enter a username') 
  }),
  password: fields.password({
    inputOnly: true,
    label: 'Password',
    required: validators.required('Please enter a password') 
  }),
  confirm_password:  fields.password({
    inputOnly: true,
    label: 'Confirm Password',
    required: validators.required('Please confirm your password'),
    validators: [validators.matchField('password')]
  })
});

module.exports = register_form;