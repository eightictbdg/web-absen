const forms = require('forms');
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;
 
var login_form = forms.create({
    username: fields.string({
      inputOnly: true,
      widget: widgets.text({ classes: ['form-control'] }),
      label: 'Username',
      required: validators.required('Please enter a username') 
    }),
    password: fields.password({
      inputOnly: true,
      widget: widgets.password({ classes: ['form-control'] }),
      label: 'Password',
      required: validators.required('Please enter a password') 
    })
});

module.exports = login_form;