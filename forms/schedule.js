const forms = require('forms');
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;
 
module.exports = function() {
  return forms.create({
    date: fields.string({
      widget: widgets.date(),
      hideError: true,
      inputOnly: true,
      required: validators.required('Please enter a date') 
    }),
    passkey: fields.string({
      hideError: true,
      inputOnly: true,
      required: validators.required('Please enter a passkey') 
    }),
    info: fields.string({
      inputOnly: true
    })
  });
}