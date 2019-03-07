/*
	jshint 
	
	eqnull: true,
	noempty: true,
	eqeqeq: true,
	laxbreak: true,
	curly: true,
	esnext: true,
	undef: true,
	jquery: true
	
	
	CODE CLEAN: 07/03/2019 
	
*/
	
	// ------------- [  V A L I D A T I O N  .  J S  ] ------------- \\
	
	
	// VALIDATION RULES
	function Validation(ValidationStatus, Data)
	{
		const CURRENTDATE = new Date();
		const DATE = FormatDate(CURRENTDATE);
		
		let ValidationFailedData = [];
		let ValidationSuccessfulData = {};
		let ValidationFailedStatus = [];
		let ValidationFailedClass = [];
		let ValidationSuccessMessage = [];
		let ValidationInputIDs = [];
		
		ValidationStatus = true;
		
		console.log(Data);
		
		// ENTER EACH ELEMENT
		for (let Key in Data )
		{
			// LOOP INDIVIDUAL KEYS WITHIN VALIDATION ELEMENT
			for (let Keys in Data[Key])
			{
				// BASE VARIABLES
				const RULE = Keys.toUpperCase();
				const INPUT = $('[data-validationcount="'+Key+'"]');
				const VALUE = INPUT.val();
				const CLASS = INPUT.attr('class');
				const DATASAVE = INPUT.attr('data-save');
				const INPUTID = INPUT.attr('data-inputid');
				const ECODE = INPUT.attr('data-validationmessage');
				const FORMATED = FormatDate(VALUE);
				const STAGE = (RULE === 'PSTARTDATE' ? 1 : RULE === 'FITMENTDATE' ? 1 : 2);
				const OUTPUT = INPUT.attr('data-validationoutput');
				const DIFF = DateDifference(DATE.F, FORMATED.F, STAGE);
				const OPTION = (INPUT.attr('data-validationoption') === undefined ? 0 : INPUT.attr('data-validationoption'));
				const OPTIONS = (OPTION === 0 ? false : ValidationOptions(OPTION));
				
				
				// RESET VALIDATION VISUALS
				INPUT.css('border-bottom','');
				INPUT.next('.ValidationErrorMessage_Visual').remove();
			
			
			
				// ---------------- [ VALIDATION RULES ] ---------------- //
			
			
			
				// ----- [ POLICY START DATE VALIDATION ]
				if (RULE === 'PSTARTDATE')
				{
					if ( VALUE === "" )
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
					}
					// PASSED DATE IS BEFORE TODAY [DAYS < 0]
					else if ( DIFF < 0 )
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '3');
						ValidationFailedClass.push(CLASS);
					}
					// PASSED DATE IS OVER 30 DAYS [DAYS > 30]
					else if ( DIFF > 30 )
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '4');
						ValidationFailedClass.push(CLASS);
					}
					// VALID DATE
					else
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
				}
				
				
				// ----- [ AGE VALIDATION ]
				if (RULE === 'AGE')
				{
					// VALIDATION RULE BESPOKE VARIABLES
					let MinimumAge;
					let MaximumAge;
					let BirthdayCheck;
					
					// BUILD MINIMUM AND MAXIMUM VALUES
					if ( OPTIONS.OPTION === 'MOTORTRADE' || OPTIONS.OPTION === 'MT' )
					{
						MinimumAge = 23;
						MaximumAge = 75;
					}
					else if ( OPTIONS.OPTION === 'YOUNGDRIVER' || OPTIONS.OPTION === 'YD' )
					{
						MinimumAge = 16;
						MaximumAge = 25;
						BirthdayCheck = true;
					}
					else
					{
						MinimumAge = 16;
						MaximumAge = 75;
					}
					
					// AGE WITHIN MINIMUM AND MAXIMUM
					if ( DIFF.YEAR >= MinimumAge && DIFF.YEAR <= MaximumAge )
					{
						if ( DIFF.YEAR === 16 )
						{
							if ( DIFF.DAY >= -14 && DIFF.DAY < 0 )
							{				
								ValidationSuccessfulData[Key] = VALUE;
							}
							else
							{
								ValidationStatus = false;
								ValidationFailedData.push(Key);
								ValidationFailedStatus.push(ECODE || '7');
								ValidationFailedClass.push(CLASS);
							}
						}
						else
						{
							ValidationSuccessfulData[Key] = VALUE;
						}
					}
					// AGE EXCEEDS MAXIMUM VALUE
					else if ( DIFF.YEAR > MaximumAge )
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '5');
						ValidationFailedClass.push(CLASS);
					}
					else
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '6');
						ValidationFailedClass.push(CLASS);
					}
				}
				
				
				// ----- [ REQUIRED FIELD VALIDATION ]
				if (RULE === 'REQUIRED')
				{
					// VALIDATION RULE BESPOKE VARIABLES
					let StringValidator = /[A-Za-z]|[0-9]/;
					
					// VALUE FIELD RETURNS BLANK
					if (VALUE === "")
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '8');
						ValidationFailedClass.push(CLASS);
						ValidationInputIDs.push(INPUTID);
					}
					// VALUE FIELD CONTAINS CHARACTERS
					else
					{
						// VALUE FIELD CONTAINS STRING AND INTEGER CHARACTERS
						if ( VALUE.match(StringValidator) )
						{
							ValidationSuccessfulData[Key] = VALUE;
						}
						// VALUE FIELD CONTAINS ONLY SYMBOLS OR SPACINGS
						else
						{
							ValidationStatus = false;
							ValidationFailedData.push(Key);
							ValidationFailedStatus.push(ECODE || '27');
							ValidationFailedClass.push(CLASS);
							ValidationInputIDs.push(INPUTID);
						}
					}
				}
				
				
				// ----- [ AUTOCOMPLETE VALIDATION ]
				if (RULE === 'AC_REQUIRED')
				{
					// VALIDATION RULE BESPOKE VARIABLES 
					let StringValidator = /[A-Za-z]|[0-9]/;
					
					// VALUE FIELD RETURNS BLANK
					if ( VALUE === "" )
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '8');
						ValidationFailedClass.push(CLASS);
						ValidationInputIDs.push(INPUTID);
					}
					// VALUE FIELD CONTAINS CHARACTERS
					else
					{
						// VALUE FIELD CONTAINS STRING AND INTEGER CHARACTERS
						if ( VALUE.match( StringValidator ) )
						{
							ValidationSuccessfulData[Key] = VALUE;
						}
						// VALUE FIELD CONTAINS ONLY SYMBOLS OR SPACINGS
						else
						{
							ValidationStatus = false;
							ValidationFailedData.push(Key);
							ValidationFailedStatus.push(ECODE || '27');
							ValidationFailedClass.push(CLASS);
							ValidationInputIDs.push(INPUTID);
						}
					}
				}
				
				
				// ----- [ FIRST NAME VALIDATION ]
				if (RULE === 'FNAME_REQUIRED')
				{
					// VALIDATION RULE BESPOKE VARIABLES 
					let StringValidator = /[A-Za-z]|[0-9]/;
					let Max_Length = 50;
					
					// VALUE FIELD RETURNS BLANK
					if ( VALUE === "" )
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '8');
						ValidationFailedClass.push(CLASS);
						ValidationInputIDs.push(INPUTID);
					}
					// VALUE FIELD CONTAINS CHARACTERS 
					else
					{
						// VALIDATE VALUE FOR STRINGS AND INTEGERS
						if ( VALUE.match( StringValidator ) )
						{
							
							if ( VALUE.length < Max_Length )
							{
								ValidationSuccessfulData[Key] = VALUE;
							}
							else
							{
								ValidationStatus = false;
								ValidationFailedData.push(Key);
								ValidationFailedStatus.push(ECODE || '28');
								ValidationFailedClass.push(CLASS);
								ValidationInputIDs.push(INPUTID);
							}
							
						}
						else
						{
							ValidationStatus = false;
							ValidationFailedData.push(Key);
							ValidationFailedStatus.push(ECODE || '27');
							ValidationFailedClass.push(CLASS);
							ValidationInputIDs.push(INPUTID);
						}
					}
				}
				
				
				// ----- [ LAST NAME VALIDATION ]
				if (RULE === 'LNAME_REQUIRED')
				{
					// VALIDATION RULE BESPOKE VARIABLES 
					let StringValidator = /[A-Za-z]|[0-9]/;
					let Max_Length = 30;
					
					// VALUE FIELD RETURNS BLANK
					if ( VALUE === "" )
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '8');
						ValidationFailedClass.push(CLASS);
						ValidationInputIDs.push(INPUTID);
					}
					// VALUE FIELD CONTAINS CHARACTERS 
					else
					{
						// VALIDATE VALUE FOR STRINGS AND INTEGERS
						if ( VALUE.match( StringValidator ) )
						{
							
							if ( VALUE.length < Max_Length )
							{
								ValidationSuccessfulData[Key] = VALUE;
							}
							else
							{
								ValidationStatus = false;
								ValidationFailedData.push(Key);
								ValidationFailedStatus.push(ECODE || '28');
								ValidationFailedClass.push(CLASS);
								ValidationInputIDs.push(INPUTID);
							}
							
						}
						else
						{
							ValidationStatus = false;
							ValidationFailedData.push(Key);
							ValidationFailedStatus.push(ECODE || '27');
							ValidationFailedClass.push(CLASS);
							ValidationInputIDs.push(INPUTID);
						}
					}
				}
				
				
				// ----- [ YES/NO SELECTION VALIDATION ]
				if (RULE === 'YES/NO')
				{
					if ( typeof(DATASAVE) !== 'undefined' && DATASAVE !== '' )
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
					else
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '8');
						ValidationFailedClass.push(CLASS);
					}
				}
				
				
				// ----- [ CORRECT VEHICLE VALIDATION ]
				if (RULE === 'CORRECTVEHICLE')
				{
					if ( typeof(OUTPUT) === 'undefined' || OUTPUT === '' || OUTPUT === '1' || OUTPUT === 1 )
					{
						ValidationSuccessfulData[Key] = VALUE;
						ValidationSuccessMessage.push(Key);

					}
					else if (OUTPUT === '0' || OUTPUT === 0)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '18');
						ValidationFailedClass.push(CLASS);
					}
				}
				
				
				// ----- [ SELECT INPUT VALIDATION ]
				if (RULE === 'SELECT')
				{
					if (DATASAVE !== '' && DATASAVE !== 0 && DATASAVE !== '0')
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
					else
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '8');
						ValidationFailedClass.push(CLASS);
					}
				}
				
				
				// ----- [ VALID/INVALID INPUTS VALIDATION ]
				if (RULE === 'VALID/INVALID')
				{
					if (VALUE != 0 && VALUE == 1 )
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
					else if (VALUE === '' || VALUE == undefined)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '19');
						ValidationFailedClass.push(CLASS);
					}
					else
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '18');
						ValidationFailedClass.push(CLASS);
					}
				}
				
				
				// ----- [ SINGLE PROPOSER VALIDATION ]
				if (RULE === 'SINGLEPROPOSER')
				{
					// VALIDATION RULE BESPOKE VARIABLES
					let People;
					let Proposers = 0;
					
					if (VALUE.length > 0)
					{
						People = VALUE.split(',');
						
						$.each(People, function(Person)
						{
							Proposers += (People[Person] == 1 ? 1 : 0);
						});
					}
					else
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '21');
					}
					
					
					if (Proposers === 1 || Proposers === '1')
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
					else if (Proposers > 1)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '21');
					}
					else if (Proposers < 1)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '23');
					}
				}
				
				
				// ----- [ VEHICLES VALIDATION ]
				if (RULE === 'VEHICLES')
				{
					if (VALUE === 1)
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
					else if (VALUE > 1 || VALUE === 0)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '22');
					}
				}
				
				
				// ----- [ SUB FORM VALIDATION ]
				if (RULE === 'SUBFORM')
				{
					// VALIDATION RULE BESPOKE VARIABLES
					let SubForm;
					let InvalidItem = 0;
					
					if (VALUE.length > 0)
					{
						SubForm = VALUE.split(',');
						
						$.each(SubForm, function(Form){
							InvalidItem += (SubForm[Form] == 2 ? 1 : 0);
						});
					}
					else
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
					
					if (InvalidItem === 0)
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
					else
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '20');
						//ValidationFailedClass.push(CLASS);
					}
				}
				
				
				// ----- [ DEFAULT RANGE VALIDATION ]
				if (RULE === 'RANGE')
				{
					// VALIDATION RULE BESPOKE VARIABLES
					let MinimumRange;
					let MaximumRange;
					
					
					if (!OPTION)
					{
						MinimumRange = -1;
						MaximumRange = 20000000;
					}
					
					if (VALUE <= MinimumRange || VALUE >= MaximumRange)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '14');
						ValidationFailedClass.push(CLASS);
					}
					else
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
				}
				
				
				// ----- [ LOGIN CREDENTIAL VALIDATION ]
				if(RULE === 'LOGINCREDENTIAL')
				{
					// SUBMISSION VALIDATION AS EMAIL
					if(/^(\w+|\d+)([\.\-!#$%&'*+\/=?^_`{|}~]?([a-z]|[0-9]))*@\w+([\.-]?\w+)*(\.\w{1,3})+$/i.exec(VALUE) !== null)
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
					// SUBMISSION VALIDATION AS PHONE NUMBER
					else if(/^[0-9\'\- ]{11,13}$/i.exec(VALUE) !== null)
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
					else
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);	
						ValidationFailedStatus.push(ECODE || '9');
						ValidationFailedClass.push(CLASS);						
					}
				}
				
				
				// ----- [ LOGIN PASSWORD VALIDATION ]
				if(RULE === 'LOGINPASSWORD')
				{
					if(VALUE.length < 8)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '1');
						ValidationFailedClass.push(CLASS);
					}
					else
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
				}
				
				
				// ----- [ EMAIL VALIDATION ]
				if(RULE === 'EMAIL')
				{
					const SPLIT_EMAIL = (VALUE === '' ? false : VALUE.split('@').pop());
					const ADDITIONAL_OPTIONS = (OPTIONS.RULE === undefined ? true : ValidateOptions(OPTIONS, SPLIT_EMAIL, RULE));
					
					if(/^(\w+|\d+)([\.\-!#$%&'*+\/=?^_`{|}~]?([a-z]|[0-9]))*@\w+([\.-]?\w+)*(\.\w{1,3})+$/i.exec(VALUE) === null)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '10');
						ValidationFailedClass.push(CLASS);
					}
					// VALID EMAIL 
					else
					{
						if (!ADDITIONAL_OPTIONS)
						{
							ValidationStatus = false;
							ValidationFailedData.push(Key);
							ValidationFailedStatus.push(ECODE || '17');
							ValidationFailedClass.push(CLASS);
						}
						else
						{
							ValidationSuccessfulData[Key] = VALUE;
						}
					}
				}
				
				
				// ----- [ MOBILE / LANDLINE VALIDATION ]
				if (RULE === 'PHONE')
				{
					if(/^[0-9\'\- ]{11,13}$/i.exec(VALUE) !== null)
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
					else
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);	
						ValidationFailedStatus.push(ECODE || '11');
						ValidationFailedClass.push(CLASS);						
					}
				}
				
				
				// ----- [ PASSWORD VALIDATION ]
				if (RULE === 'PASSWORD')
				{
					if(VALUE.length < 8)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '1');
						ValidationFailedClass.push(CLASS);
					}
					else
					{
						// UPPERCASE VALIDATION
						if (VALUE.replace(/[^A-Z]/g, "").length < 1)
						{
							ValidationStatus = false;
							ValidationFailedData.push(Key);
							ValidationFailedStatus.push(ECODE || '1');
							ValidationFailedClass.push(CLASS);
						}
						else
						{
							ValidationSuccessfulData[Key] = VALUE;
						}
					}
				}
				
				
				// ----- [ CONFIRMATION PASSWORD VALIDATION ]				
				if (RULE === 'PASSWORD2')
				{
					if ($('[data-validation="Password"]').val() !== VALUE || $('[data-validation="Password"]').val() === '')
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '2');
						ValidationFailedClass.push(CLASS);
					}
					else
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
				}
				
				
				// ----- [ POSTCODE VALIDATION ]
				if(RULE === 'POSTCODE')
				{
					const AREA = VALUE.split(' ').join('').slice(0, - 3);
					const SECTOR = VALUE.substr(VALUE.length - 3);
					const ADDITIONAL_OPTIONS = (OPTIONS.RULE === undefined ? true : ValidateOptions(OPTIONS, AREA, RULE));
					const REGION = (OPTIONS.RULE === 'REGION' ? ValidateOptions(OPTIONS, 0, RULE) : 'GB');
					
					if(AreacodeValidation(VALUE, REGION))
					{
						if (!ADDITIONAL_OPTIONS)
						{
							ValidationStatus = false;
							ValidationFailedData.push(Key);
							ValidationFailedStatus.push(ECODE || '17');
							ValidationFailedClass.push(CLASS);
						}
						else
						{
							// FORMAT POSTCODE ON SUCCESS
							INPUT.val(AREA.toUpperCase()+' '+SECTOR.toUpperCase());
							ValidationSuccessfulData[Key] = VALUE;
						}
					}
					else
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '13');
						ValidationFailedClass.push(CLASS);
					}
				}
				
				
				// ----- [ LOCATE VALIDATION ]
				if (RULE === 'LOCATE')
				{
					const FOUND = ValidateOptions(OPTIONS, 0, RULE);
					let Message;
					
					if (!FOUND)
					{
						Message = OPTIONS.OPTION+' has not been found!';
					}
					else
					{
						Message = 'Found '+FOUND+' occurance(s) of "'+OPTIONS.OPTION+'" ';
					}
				}
				
				
				// ----- [ FITMENT DATE VALIDATION ]
				if (RULE === 'FITMENTDATE')
				{
					const FITMENT_DATE = new Date(VALUE);
					const FORMATED_FITMENT_DATE = FormatDate(OPTION);
					const FITMENT_DIFF = DateDifference(FORMATED_FITMENT_DATE.F, FORMATED.F, 1);

					// IF FITMENT DATE IS NOT A SUNDAY
					if (FITMENT_DATE.getDay() !== 0 && FITMENT_DATE.getDay() !== 6)
					{
						// FITMENT DATE IS MORE THAN 2 DAYS AFTER CURRENT DATE
						if (DIFF > 2)
						{
							// FITMENT DATE IS LESS THAN 7 DAYS AFTER START DATE
							if (FITMENT_DIFF < 7)
							{
								ValidationSuccessfulData[Key] = VALUE;
							}
							else
							{
								ValidationStatus = false;
								ValidationFailedData.push(Key);
								ValidationFailedStatus.push(ECODE || '25');
								ValidationFailedClass.push(CLASS);
							}
						}
						else
						{
							ValidationStatus = false;
							ValidationFailedData.push(Key);
							ValidationFailedStatus.push(ECODE || '24');
							ValidationFailedClass.push(CLASS);
						}
						
					}
					else
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '26');
						ValidationFailedClass.push(CLASS);
					}
				}
				
			}
		}
		
		// DISPLAY ANY ERROR CASES
		$(ValidationFailedData).each(function(i)
		{
			let Element = $('[data-validationcount="'+ValidationFailedData[i]+'"]');
			Element.css('border-bottom', '2px solid red');
			Element.after('<p class="ValidationErrorMessage_Visual '+ValidationFailedClass[i]+'" id="I'+ValidationInputIDs[i]+'">'+ValidationCodes(ValidationFailedStatus[i])+'</p>');
		});
		
		
		// DISPLAY SUCCESS CASES WHERE NEEDED
		$(ValidationSuccessMessage).each(function(i)
		{
			let Element = $('[data-validationcount="'+ValidationSuccessMessage[i]+'"]');
			Element.css('border-bottom', '3px solid green');

		});
		
		ValidationSuccessfulData = JSON.stringify(ValidationSuccessfulData);
		
		// RETURN STATUS
		let ValidationOutput = [ValidationStatus,ValidationFailedData,ValidationSuccessfulData];
		return ValidationOutput;
	}
	
	
	
	// ------------- [  V A L I D A T I O N   R U N   A C T I O N S  ] ------------- \\
	
	
	
	// BUILD VALIDATION ELEMENTS 
	function ValidationBuild()
	{
		let DataValidate = $('button[data-validate]').attr('data-validate');
		let Class;
		let ValidationRule;
		
		// INSERT COUNT FOR VALIDATION FIELDS
		$('[data-validation]').each(function( ValidationCount )
		{
			// BUILD VALIDATION COUNT FOR FORM ELEMENT REFERENCE
			$(this).attr('data-validationcount', ValidationCount);
			
			// RUN VALIDATION IF FORM VALIDATION IS INVALID
			if (DataValidate == 2 && typeof(DataValidate) !== "undefined") { ValidationSingle($(this)); }
		});
	}

	
	// RUN CHECKS AND ACTION FOR HIDDEN AND VISIBLE VALIDATION ELEMENTS
	function HiddenValidation(Current)
	{
		let Class = $(Current).attr('class');
		let ValidationRule = $(Current).attr('data-validation');
		let HiddenValidation = $(Current).attr('data-hiddenvalidation');
		let Label = $(Current).attr('data-label');
		
		if (Class == 'hidden' || Class == 'hidden ')
		{
			$(Current).attr('data-hiddenvalidation', ValidationRule);
			$(Current).attr('data-validation', '');
		}
		else if (HiddenValidation && !ValidationRule || ValidationRule === '')
		{
			$(Current).attr('data-validation', HiddenValidation);
			$(Current).removeAttr('data-hiddenvalidation');
		}
	}
	
	// RUN VALIDATION ON PASSED ELEMENT
	function ValidationSingle(Clicked)
	{
		let Inner = [];
		let Data = [];
		let ValidationType = $(Clicked).attr('data-validation');
		let DataSave = $(Clicked).val();
		let Count = $(Clicked).attr('data-validationcount');
		
		// PUSH DATA
		Inner[ValidationType] = DataSave;
		Data[Count] = Inner;
		ValidationOutput = Validation(true, Data);
	}


	// RUN VALIDATION ON ENTIRE FORM OR PAGE
	function ValidationMultiple(Clicked)
	{
		let Data = [];
		let Popup = ($('.Popup').html() != undefined ? true : false);
		let DataValidation = (Popup === true ? $('.Popup').find('[data-validation]') : $('[data-validation]'));
		
		// BUILD VALIDATION DATA OBJECT
		$(DataValidation).each(function(Count) 
		{
			let Inner = [];
			let ValidationType = $(this).attr('data-validation');
			let Label = $(this).attr('data-label');
			let DataSave = $(this).attr('data-save');
			let Class = $(this).attr('class');
			let Action = $(this).attr('data-action');
			let Element = $(this).prop('tagName');
			
			// BUILD ELEMENT ATTRIBUTE ARRAY
			let ATTR = {
				'CLASS': Class,
				'ELEMENT': Element,
				'ACTION': Action,
				'VALIDATION': ValidationType,
			};
			
			// RUN VALIDATION EXCLUSION FUNCTION 
			if (ValidationExclusions(this, ATTR)){ return 0; }
			
			// PUSH DATA
			Inner[ValidationType] = DataSave;
			Data[Count] = Inner;
		});	
		
		// RUN VALIDATION FUNCTION
		ValidationOutput = Validation(true, Data);
		$(Clicked).attr('data-status', ValidationOutput[1]); 
	}

	
	// RUN VALIDATION EXCLUSIONS
	function ValidationExclusions(Clicked, ATTR)
	{
		let ExcludeValidation = false;
		
		// IF THE ELEMENT IS NOT VISIBLE
		if ($(Clicked).is(":visible"))
		{
			//ELEMENT IS VISIBLE
		} 
		else 
		{ 
			// ELEMENT IS NOT VISIBLE RUN ADDITIONAL CHECKS
			
			// [EXCLUDE-IF] VALIDATION ELEMENT IS HIDDEN BY CLASS & NOT A SUB FORM
			if (ATTR.VALIDATION !== 'SubForm' && ATTR.VALIDATION !== 'SingleProposer' && ATTR.VALIDATION !== 'Vehicles'){ ExcludeValidation = true; }
		}
		
		// [EXCLUDE-IF] ELEMENT IS A BUTTON & NOT A VEHICLE VALIDATION
		if (ATTR.ELEMENT === 'BUTTON' && ATTR.ACTION !== 'CorrectVehicle'){ ExcludeValidation = true }
		
		// RETURN RESULT
		return ExcludeValidation; 
	}
	
	
	// RUN VALIDATION ON VALIDATE 
	function ValidationValidate(Clicked)
	{
		// DIALOG AREA ATTRIBUTES
		const Button = $(Clicked);
		const Action = $(Clicked).attr('data-action');
		const ValidationAction = $(Clicked).attr('data-validationaction');
		const Validate = Button.attr('data-validate');
		const UpdateButtonAction = ($(Clicked).attr('data-inputid') == 240 ? 'AddLead' : 'LoadContent');
			
		// VALIDATION BUTTON FOUND WITHIN POPUP
		if (Button)
		{
			// RUN FULL FORM VALIDATION
			ValidationMultiple(Clicked);
			
			// COLLECT VALIDATION RESULTS
			let Status = Button.attr('data-status');
			
			if (Validate === '1')
			{
				if (typeof(ValidationAction) == "undefined" && Action !== 'ValidationInvalid'){ $(Clicked).attr('data-actionbackup', Action); }
				
				// VALIDATION ACTION IS UNDEFINED
				if (ValidationAction == undefined || ValidationAction == '')
				{ 
					$(Clicked).attr('data-validationaction', Action); 
					$(Clicked).removeAttr('data-action'); 
				}
				
				
				// IF VALIDATION INVALID ACTION HAS ALREADY BEEN APPENED
				if (Action == 'ValidationInvalid' && typeof(ValidationAction) != "undefined")
				{
					// IF VALIDATION ACTION HAS BEEN SET TO VALIDATION ERROR ACTION
					if (ValidationAction === 'ValidationInvalid')
					{ 
						$(Clicked).attr('data-action', $(Clicked).attr('data-actionbackup')); 
					}
					// UPDATE DATA ACTION AS NORMAL
					else
					{
						$(Clicked).attr('data-action', ValidationAction);
						$(Clicked).removeAttr('data-validationaction');
					}
				}

			}
			
			// STOPS ONLOAD VALIDATION ERROR ON ".LENGTH"
			if (Status)
			{
				// VALIDATION RESULTS RETURNED INVALID ELEMENTS
				if (Status.length > 0)
				{
					$('.SetFormContentValidation').attr('data-save', '2');
					if (Validate === '1'){ $(Clicked).attr('data-action', 'ValidationInvalid'); }
				}
				else
				{
					$('.SetFormContentValidation').attr('data-save', '1');
					// $(Clicked).attr('data-action', UpdateButtonAction);
				}
			}
			// IF STATUS HASN'T BEEN GENERATED REVERT BACK TO ORIGINAL CONDITION
			else
			{
				$('.SetFormContentValidation').attr('data-save', '1');
				$(Clicked).attr('data-action', $(Clicked).attr('data-actionbackup'));
			}
			
			// RUN VALIDATION REPORTS [ CONSOLE LOG ]
			ValidationReport(Clicked);
		}
	}
	
		
	// RUN VALIDATE REPORTS
	function ValidationReport(Clicked)
	{
		let Status = $(Clicked).attr('data-status');
		let InvalidElements = [];
		
		if (Status != '' || typeof(Status) != undefined || Status != 'undefined' || Status != ' ')
		{
			// SPLIT VALIDATION COUNT
			Status = Status.split(',');
			
			// GET EACH INVALID ELEMENTS DATA LABEL
			$.each(Status, function(count){ InvalidElements[count] = $('[data-validationcount="'+Status[count]+'"]').attr('data-label'); });
			
			// DISPLAY INVALID MESSAGE FOR EACH FORM ELEMENT
			$.each(InvalidElements, function(Element){ console.log('['+(Element+1)+'] '+InvalidElements[Element]+' has Validation Error'); });
		}
	}
	
	
	
	// ------------- [  V A L I D A T I O N   R U L E S  ] ------------- \\
	
	
	
	// VALIDATES VALUE BASED ON OPTIONAL RULE SETS
	function ValidateOptions(OPTIONS, SEARCHABLE, RULE)
	{
		let ParameterFound = false;
		let Method = (OPTIONS.RULE === 'INCLUDE' ? true : false);
		let Status = false;
		
		// STOP TOUPPER FUNCTION BREAKING WTIH FALSY VALUE	
		Status = (SEARCHABLE === false ? OPTIONS.OPTION = false : false);
		
		// OPTIONAL VALIDATION FOR POSTCODE AND EMAIL
		if (RULE === 'POSTCODE' && OPTIONS.RULE !== 'REGION' || RULE === 'EMAIL')
		{
			$(OPTIONS.OPTION).each(function(i)
			{
				ParameterFound = (OPTIONS.OPTION[i].toUpperCase().search(SEARCHABLE.toUpperCase()) > -1 ? Status = (true === Method) ? true : false : false);
			});
		}
		// LOCATE ELEMENT PARAMETER PASSED
		else if (OPTIONS.RULE === 'FIND')
		{
			$(OPTIONS.OPTION).each(function(i)
			{
				ParameterFound = ($(OPTIONS.OPTION[i]).size() >= 1 ? Status = $(OPTIONS.OPTION[i]).size() : false);
			});
		}
		// POSTCODE REGION VALIDATION
		else if (OPTIONS.RULE === 'REGION')
		{
			Status = OPTIONS.OPTION || 'GB';
		}
		
		return Status;
	}
	
	
	// BUILDS VALIDATION OPTIONAL RULE SETS
	function ValidationOptions(OPTION)
	{
		let ValidationOption = [];
		let ValidationOptionRule;
		let ValidationOptionsBreakdown;
		let ValidationOptionOutput;
		
		// CHECK FOR VALIDATION CODES
		if (OPTION.toUpperCase().search('INCLUDE:') > -1 )
		{
			ValidationOptionRule = 'INCLUDE';
			ValidationOptionsBreakdown = OPTION.toUpperCase().split('INCLUDE:').pop();
			ValidationOption = ValidationOptionsBreakdown .split(',');
		}
		else if (OPTION.toUpperCase().search('EXCLUDE:') > -1 )
		{
			ValidationOptionRule = 'EXCLUDE';
			ValidationOptionsBreakdown = OPTION.toUpperCase().split('EXCLUDE:').pop();
			ValidationOption = ValidationOptionsBreakdown.split(',');
		}
		else if (OPTION.toUpperCase().search('REGION:') > -1 )
		{
			ValidationOptionRule = 'REGION';
			ValidationOptionsBreakdown = OPTION.toUpperCase().split('REGION:').pop();
			ValidationOption = ValidationOptionsBreakdown.split(',');
		}
		else if (OPTION.search('FIND:') > -1 || OPTION.search('find:') > -1)
		{
			ValidationOptionRule = 'FIND';
			ValidationOptionsBreakdown = (OPTION.search('FIND:') > -1 ? OPTION.split('FIND:').pop() : OPTION.split('find:').pop());
			ValidationOption = ValidationOptionsBreakdown.split(',');
		}
		// NO VALIDATION OPTIONAL RULE SET
		else if (!OPTION)
		{
			ValidationOptionOutput = false;
		}
		// VALIDATION OPTIONAL RULE SET BUT NOT FOUND [STANDARD]
		else 
		{
			ValidationOptionOutput = {
				'RULE' : 'STANDARD',
				'OPTION' : OPTION,
			};
			
			return ValidationOptionOutput;
		}
		
		ValidationOptionOutput = {
			'RULE' : ValidationOptionRule.toUpperCase(),
			'OPTION' : ValidationOption,
		};
		
		return ValidationOptionOutput;
	}
	
	
	// VALIDATE AREACODE
	function AreacodeValidation(...P) { 
		let AreacodeRegEx = new RegExp(AreacodeRegexList(P[1]));
		return AreacodeRegEx.test(P[0]); 
	}
	
	
	// CALCULATE DIFFERENCE IN TWO DATES
	function DateDifference(DATEFULL, FORMATTEDFULL, STAGE)
	{
		const DATE = new Date(DATEFULL);
		const VALIDATION_DATE = new Date(FORMATTEDFULL);
		
		// DIFFERENCE OF DATE DAYS ONLY
		if (STAGE === 1)
		{
			return Math.floor((Date.UTC(VALIDATION_DATE.getFullYear(), VALIDATION_DATE.getMonth(), VALIDATION_DATE.getDate()) - Date.UTC(DATE.getFullYear(), DATE.getMonth(), DATE.getDate()) ) / (1000 * 60 * 60 * 24));
		}
		// DIFFERENCE OF DATE FULL 
		else if (STAGE === 2)
		{
			let YearDifference = DATE.getFullYear() - VALIDATION_DATE.getFullYear();
			let MonthDifference = DATE.getMonth() - VALIDATION_DATE.getMonth();
			let DayDifference = DATE.getDate() - VALIDATION_DATE.getDate();
			
			// REMOVE ADDITIONAL YEAR DIFFERENCE > MONTH
			if (MonthDifference < 0)
			{
				MonthDifference *= - 1;
				MonthDifference = 12 - MonthDifference;
		
				YearDifference = YearDifference - 1;
			}
			
			// REMOVE ADDITIONAL YEAR DIFFERENCE > DAY
			if (DayDifference < 0)
			{
				YearDifference = YearDifference - 1;
			}
			
			const DIFFERENCE = {
				'MONTH': MonthDifference,
				'YEAR': YearDifference,
				'DAY': DayDifference
			};
			
			return DIFFERENCE;
		}
	}
	
	
	
	// ------------- [  V A L I D A T I O N   S W I T C H E S  ] ------------- \\
	
	
	
	// VALIDATION ERROR CODES
	function ValidationCodes(ValidationCode)
	{
		let ValidationStatus;
		
		switch(ValidationCode)
		{
			case '1':
				ValidationStatus = 'Password Must Contain at least 8 Characters and 1 Capital Letter';
				break;
				
			case '2':
				ValidationStatus = 'Passwords do not match';
				break;
				
			case '3':
				ValidationStatus = 'Start Date Cannot Have a Date Previous to Today';
				break;
				
			case '4':
				ValidationStatus = 'Start Date Cannot be Over <b>30 Days</b>';
				break;
				
			case '5':
				ValidationStatus = 'Invalid Age - Age Passed the Maximum';
				break;
				
			case '6':
				ValidationStatus = 'Invalid Age - Age Not Passed the Minimum';
				break;
				
			case '7':
				ValidationStatus = 'Invalid Age - 16 & More Than 2 Weeks Until Birthday';
				break;
				
			case '8':
				ValidationStatus = 'Field Required';
				break;
				
			case '9':
				ValidationStatus = 'Email Address or Phone Number Not Recognized';
				break;
				
			case '10':
				ValidationStatus = 'Please Enter a Valid Email Address';
				break;
				
			case ('11'):
				ValidationStatus = 'Please Enter a Valid Phone Number';
				break;
				
			case '12':
				ValidationStatus = 'Please Enter a Valid Landline Number';
				break;
				
			case '13':
				ValidationStatus = 'Please Enter a Valid Postcode';
				break;
				
			case '14':
				ValidationStatus = 'Please Select a Value';
				break;
				
			case '15':
				ValidationStatus = 'Example Custom Error Message';
				break;
				
			case '16':
				ValidationStatus = 'Not Accepted Email';
				break;
				
			case '17':
				ValidationStatus = 'Additional Criteria Has Not Been Met';
				break;
				
			case '18':
				ValidationStatus = 'Vehicle Declined';
				break;
				
			case '19':
				ValidationStatus = 'Vehicle Must Be Confirmed';
				break;
				
			case '20':
				ValidationStatus = '<b>VALIDATION ERROR</b> - There are Still Invalid Vehicle or Driver Tabs';
				break;
				
			case '21':
				ValidationStatus = '<b>VALIDATION ERROR</b> - Cover has More Than One Proposer';
				break;
			
			case '22':
				ValidationStatus = '<b>VALIDATION ERROR</b> - One or More Vehicle(s) Attached to Cover';
				break;
				
			case '23':
				ValidationStatus = '<b>VALIDATION ERROR</b> - Cover hasn\'t Got a Proposer';
				break;
				
			case '24':
				ValidationStatus = 'Fitment Date Should be 2 Days or More From Today';
				break;
			
			case '25':
				ValidationStatus = 'Fitment Date is More Than 7 Days after Start Date';
				break;
			
			case '26':
				ValidationStatus = 'Unable to Fit on Weekends';
				break;
			
			case '27':
				ValidationStatus = '<b>Required</b> - Must Contain Letter(s) and/or Number(s)';
				break;
			
			case '28':
				ValidationStatus = '<b>Required</b> - Character Length has Exceeded 50 Characters';
				break;
				
			case '29':
				ValidationStatus = '<b>Required</b> - Character Length has Exceeded 30 Characters';
				break;
			
			default:
				ValidationStatus = 'Invalid Input';
				break;
		}
		
		return ValidationStatus;
	}
	
	
	// REGEX COUNTRY AREA CODES
	function AreacodeRegexList(Country)
	{
		let AreacodeRegexArray = {

			'GB' : '^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$',
			'US' : '\d{5}([ \-]\d{4})?',
			'JE' : 'JE\d[\dA-Z]?[ ]?\d[ABD-HJLN-UW-Z]{2}',
			'GG' : 'GY\d[\dA-Z]?[ ]?\d[ABD-HJLN-UW-Z]{2}',
			'IM' : 'IM\d[\dA-Z]?[ ]?\d[ABD-HJLN-UW-Z]{2}',
			'CA' : '[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ ]?\d[ABCEGHJ-NPRSTV-Z]\d',
			'DE' : '\d{5}',
			'JP' : '\d{3}-\d{4}',
			'FR' : '\d{2}[ ]?\d{3}',
			'AU' : '\d{4}',
			'IT' : '\d{5}',
			'CH' : '\d{4}',
			'AT' : '\d{4}',
			'ES' : '\d{5}',
			'NL' : '\d{4}[ ]?[A-Z]{2}',
			'BE' : '\d{4}',
			'DK' : '\d{4}',
			'SE' : '\d{3}[ ]?\d{2}',
			'NO' : '\d{4}',
			'BR' : '\d{5}[\-]?\d{3}',
			'PT' : '\d{4}([\-]\d{3})?',
			'FI' : '\d{5}',
			'AX' : '22\d{3}',
			'KR' : '\d{3}[\-]\d{3}',
			'CN' : '\d{6}',
			'TW' : '\d{3}(\d{2})?',
			'SG' : '\d{6}',
			'DZ' : '\d{5}',
			'AD' : 'AD\d{3}',
			'AR' : '([A-HJ-NP-Z])?\d{4}([A-Z]{3})?',
			'AM' : '(37)?\d{4}',
			'AZ' : '\d{4}',
			'BH' : '((1[0-2]|[2-9])\d{2})?',
			'BD' : '\d{4}',
			'BB' : '(BB\d{5})?',
			'BY' : '\d{6}',
			'BM' : '[A-Z]{2}[ ]?[A-Z0-9]{2}',
			'BA' : '\d{5}',
			'IO' : 'BBND 1ZZ',
			'BN' : '[A-Z]{2}[ ]?\d{4}',
			'BG' : '\d{4}',
			'KH' : '\d{5}',
			'CV' : '\d{4}',
			'CL' : '\d{7}',
			'CR' : '\d{4,5}|\d{3}-\d{4}',
			'HR' : '\d{5}',
			'CY' : '\d{4}',
			'CZ' : '\d{3}[ ]?\d{2}',
			'DO' : '\d{5}',
			'EC' : '([A-Z]\d{4}[A-Z]|(?:[A-Z]{2})?\d{6})?',
			'EG' : '\d{5}',
			'EE' : '\d{5}',
			'FO' : '\d{3}',
			'GE' : '\d{4}',
			'GR' : '\d{3}[ ]?\d{2}',
			'GL' : '39\d{2}',
			'GT' : '\d{5}',
			'HT' : '\d{4}',
			'HN' : '(?:\d{5})?',
			'HU' : '\d{4}',
			'IS' : '\d{3}',
			'IN' : '\d{6}',
			'ID' : '\d{5}',
			'IL' : '\d{5}',
			'JO' : '\d{5}',
			'KZ' : '\d{6}',
			'KE' : '\d{5}',
			'KW' : '\d{5}',
			'LA' : '\d{5}',
			'LV' : '\d{4}',
			'LB' : '(\d{4}([ ]?\d{4})?)?',
			'LI' : '(948[5-9])|(949[0-7])',
			'LT' : '\d{5}',
			'LU' : '\d{4}',
			'MK' : '\d{4}',
			'MY' : '\d{5}',
			'MV' : '\d{5}',
			'MT' : '[A-Z]{3}[ ]?\d{2,4}',
			'MU' : '(\d{3}[A-Z]{2}\d{3})?',
			'MX' : '\d{5}',
			'MD' : '\d{4}',
			'MC' : '980\d{2}',
			'MA' : '\d{5}',
			'NP' : '\d{5}',
			'NZ' : '\d{4}',
			'NI' : '((\d{4}-)?\d{3}-\d{3}(-\d{1})?)?',
			'NG' : '(\d{6})?',
			'OM' : '(PC )?\d{3}',
			'PK' : '\d{5}',
			'PY' : '\d{4}',
			'PH' : '\d{4}',
			'PL' : '\d{2}-\d{3}',
			'PR' : '00[679]\d{2}([ \-]\d{4})?',
			'RO' : '\d{6}',
			'RU' : '\d{6}',
			'SM' : '4789\d',
			'SA' : '\d{5}',
			'SN' : '\d{5}',
			'SK' : '\d{3}[ ]?\d{2}',
			'SI' : '\d{4}',
			'ZA' : '\d{4}',
			'LK' : '\d{5}',
			'TJ' : '\d{6}',
			'TH' : '\d{5}',
			'TN' : '\d{4}',
			'TR' : '\d{5}',
			'TM' : '\d{6}',
			'UA' : '\d{5}',
			'UY' : '\d{5}',
			'UZ' : '\d{6}',
			'VA' : '00120',
			'VE' : '\d{4}',
			'ZM' : '\d{5}',
			'AS' : '96799',
			'CC' : '6799',
			'CK' : '\d{4}',
			'RS' : '\d{6}',
			'ME' : '8\d{4}',
			'CS' : '\d{5}',
			'YU' : '\d{5}',
			'CX' : '6798',
			'ET' : '\d{4}',
			'FK' : 'FIQQ 1ZZ',
			'NF' : '2899',
			'FM' : '(9694[1-4])([ \-]\d{4})?',
			'GF' : '9[78]3\d{2}',
			'GN' : '\d{3}',
			'GP' : '9[78][01]\d{2}',
			'GS' : 'SIQQ 1ZZ',
			'GU' : '969[123]\d([ \-]\d{4})?',
			'GW' : '\d{4}',
			'HM' : '\d{4}',
			'IQ' : '\d{5}',
			'KG' : '\d{6}',
			'LR' : '\d{4}',
			'LS' : '\d{3}',
			'MG' : '\d{3}',
			'MH' : '969[67]\d([ \-]\d{4})?',
			'MN' : '\d{6}',
			'MP' : '9695[012]([ \-]\d{4})?',
			'MQ' : '9[78]2\d{2}',
			'NC' : '988\d{2}',
			'NE' : '\d{4}',
			'VI' : '008(([0-4]\d)|(5[01]))([ \-]\d{4})?',
			'PF' : '987\d{2}',
			'PG' : '\d{3}',
			'PM' : '9[78]5\d{2}',
			'PN' : 'PCRN 1ZZ',
			'PW' : '96940',
			'RE' : '9[78]4\d{2}',
			'SH' : '(ASCN|STHL) 1ZZ',
			'SJ' : '\d{4}',
			'SO' : '\d{5}',
			'SZ' : '[HLMS]\d{3}',
			'TC' : 'TKCA 1ZZ',
			'WF' : '986\d{2}',
			'XK' : '\d{5}',
			'YT' : '976\d{2}'

		};
		
		return AreacodeRegexArray[Country];
	}
	
	