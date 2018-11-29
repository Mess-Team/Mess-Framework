# Mess-Framework
Mess Framework information that will slowly build up over time as the project gets more updates and features. You can read below the descriptions of Data Attributes, Files, Methods, Naming Principles and much more. (<i>This is being worked on secondary to the actual project</i>)


## Data Attributes
Below is a list of the following attributes that are currently being developed or have a place within the __MESS__ framework. Explanations and examples should provided. However not all attributes will have fully flesh out information until they have been set as the standard. 

### Data Validation
Used for setting a Validation rule to a single input element. An example of this would be `data-validation="Required"` which would then make sure the input element field was not empty.
Validation is checked on __change__ and __keypress__ on individual input elements. __Change__ is used for elements that requires something that may not be a text input value, for instance `<select>` elements and __keypress__ is used on all elements where text input is required, for instance an `<input>` element. 

```html
<input type="text" data-validation="Required" placeholder="This is a Required Field">
```

### Data Validation Count
Used within the automatic building of the __Data__ object for which each input has the `data-validation=""` attribute. The count attribute is built by a loop which checks and searches for all elements associated with Validation. 
The number associated within the count attribute is the target indiviual used to set error messages and all element visualisations.

> [NOTE] Manual addition of `data-validationCount` value will be refactored into the automatically generated value should the element contain a `data-validation` attribute.

```html
<input type="text" data-validation="Required" placeholder="This is a Required Field" data-validationCount="0">
```

### Data Validation Option
Attribute is not required. `data-validationOption` will allow additional or refined validation rule criteria. A current example of this would be for validation of Postal Codes / Area codes where the developer could specify the country in which the postcode validation standard should be validated againsts. 

```html
<input type="text" data-validation="Areacode" data-validationOption="GB" placeholder="Please enter a Postcode (United Kingdom)">
```

Being a optional addtion to the validation rule it's perfectly acceptable to leave the attribute blank or not require it at all. However doing this sets the default validation rule for the element. 

### Data Validate
This attribute is used to apply on `<button>`, `<div>`, `<span>`, `<p>`, `<h1>`, `<img>` element tags and a multiude of other HTML elements when a users may be able to or expected to interact with such an element. 
The primary function for `data-validate` is for the application on form buttons, where a user might click. At this point the entire form would be re-validated and then enables the progression of the form. 

```html
<button data-validate="TRUE" data-action="Submit">Submit Form</button>
```

### Data Validation Status
This attribute is produced on elements such as the `<button>` where `data-valide="TRUE"` has been applied. The status attribute will hold all element ID status codes. 

> Future development plans to enable status codes to be passed through forms on submission.

```html
<button data-validate="TRUE" data-action="Submit" data-validationStatus="0,7,16,23">Submit Form</button>
```

### Data Validation ECode
This attribute is used for changing, hiding or customising the visual validation error message on an individual element. 

```html
<input type="text" data-validation="Required" placeholder="This is a Required Field" data-valiadtionECode="Oops!">
```
The example above would disable the default Required field validation message and producde `Oops!` instead.
```html
<input type="text" data-validation="Required" placeholder="This is a Required Field" data-valiadtionECode="15">
```
The example above would disable the default Required field validation message and producde `Example Custom Error Message` instead. Follow the Validation Error Codes guide for more information on predefined Validation Messages. 


