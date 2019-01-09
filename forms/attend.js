const forms = require('forms');
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

module.exports = forms.create({
  passkey: fields.string({
    widget: widgets.text({ classes: ['form-control'] }),
    hideError: true,
    inputOnly: true,
    required: validators.required('Please enter a passkey') 
  })
});