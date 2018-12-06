const forms = require('forms');
const fields = forms.fields;
const validators = forms.validators;
 
var login_form = forms.create({
    username: fields.string({ required: validators.required('Please enter a username') }),
    password: fields.password({ required: validators.required('Please enter a password') })
});

module.exports = login_form;