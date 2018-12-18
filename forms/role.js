const forms = require('forms');
const fields = forms.fields;
const validators = forms.validators;
 
module.exports = function() {
  return forms.create({
    name: fields.string({
      hideError: true,
      inputOnly: true,
      required: validators.required('Please enter a name') 
    })
  });
}