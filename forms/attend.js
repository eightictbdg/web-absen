const forms = require('forms');
const fields = forms.fields;
const validators = forms.validators;
 
module.exports = forms.create({
  passkey: fields.string({
    hideError: true,
    inputOnly: true,
    required: validators.required('Please enter a passkey') 
  })
});