// SET DATA SAVE VALUE
$('input textarea select').each(function(){
    $(this).attr('data-save', $(this).val());
});

// REMOVE DATA-SAVE ATTRIBUTE FOR SPECIFIC FIELDS
$('[data-tag="RemoveDS"]').each(function(){
	$(this).removeAttr('data-save');
});

// 	FORMS 	> 	VALIDATION
var FormsCounter = 0;

// INSERT COUNT FOR VALIDATION FIELDS
$('[data-validation]').each(function(){
	$(this).attr('data-validationcount', FormsCounter);
	FormsCounter++;
});

// VALIDATE ON FORM BUTTON CLICK
$('[data-validate="true"]').on('click', Val_RFF);

// VALIDATE ON KEYPRESS
$('[data-validation]').on('keyup change', Val_RSFF);

var Val_RFF = function RunFullForm()
{
	var Data = [];
	var Count = 0;
	
	// BUILD DATA OBJECT
	$('[data-validation]').each(function() {
		var Inner = [];
		var ValidationType = $(this).attr('data-validation');
		var DataSave = $(this).attr('data-save');
	
		// PUSH DATA
		Inner[ValidationType] = DataSave;
		Data[Count++] = Inner;
	});	
	
	// RUN VALIDATION FUNCTION
	ValidationOutput = Validation('', Data);
	$(this).attr('data-status', ValidationOutput[1]);
	
	// VALIDATION PASSED COMPLETE FORM
	if (ValidationOutput[1] == '')
	{
		$(this).next('.hidden').click();
	}
}

var Val_RSFF = function RunSingleFormField()
{
	// BUILD DATA OBJECT
	var Inner = [];
	var Data = [];
	var ValidationType = $(this).attr('data-validation');
	var DataSave = $(this).val();
	var Count = $(this).attr('data-validationcount');
	
	// PUSH DATA
	Inner[ValidationType] = DataSave;
	Data[Count] = Inner;
	
	// RUN VALIDATION FUNCTION
	ValidationOutput = Validation('', Data);
}