// SET DATA SAVE VALUE
$('input textarea select').each(function(){
    $(this).attr('data-save', $(this).val());
});

// REMOVE DATA-SAVE ATTRIBUTE FOR SPECIFIC FIELDS
$('[data-tag="RemoveDS"]').each(function(){
	$(this).removeAttr('data-save');
});

// 	FORMS > VALIDATION
var FormsCounter = 0;

// INSERT COUNT FOR VALIDATION FIELDS
$('[data-validation]').each(function(){
	$(this).attr('data-count', FormsCounter);
	FormsCounter++;
});

// VALIDATE ON FORM BUTTON CLICK
$('[data-validate="true"]').on('click', RFFV);

// VALIDATE ON KEYPRESS
$('[data-validation]').on('keyup', RSFFV);

var RFFV = function RunFullFormValidation()
{
	var Data = [];
	var Count = 0;
	
	// BUILD DATA OBJECT
	$('[data-validation]').each(function() {
		var Inner = [];
		var ValidationType = $(this).attr('data-validation');
		var DataSave = $(this).attr('data-save');
		
		if (ValidationType == 'Required')
		{
			$(this).attr('data-count', Count);
		}
	
		// PUSH DATA
		Inner[ValidationType] = DataSave;
		Data[Count++] = Inner;
	});	
	
	// RUN VALIDATION FUNCTION
	ValidationOutput = Validation('', Data);
	
	// VALIDATION PASSED
	if (ValidationOutput[1] == '')
	{
		console.log('Validation Successful.');
	}
}

var RSFFV = function RunSingleFormFieldValidation()
{
	// BUILD DATA OBJECT
	var Inner = [];
	var Data = [];
	var ValidationType = $(this).attr('data-validation');
	var DataSave = $(this).attr('data-save');
	var Count = $(this).attr('data-count');
	
	// PUSH DATA
	Inner[ValidationType] = DataSave;
	Data[Count] = Inner;
	
	// RUN VALIDATION FUNCTION
	ValidationOutput = Validation('', Data);
}