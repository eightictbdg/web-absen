const forms = require('forms');
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;
 
var login_form = forms.create({
  default_role: fields.string({
    inputOnly: true,
    widget: widgets.select(
      {
        classes: ['form-control','form-control-sm','dropdown']
      }
    ),
    label: 'Default Role'
  })
});

module.exports = login_form;