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
	
*/
	
	// VALIDATION FUNCTION
	function Validation(ValidationStatus, Data)
	{
		const CURRENTDATE = new Date();
		const DATE = FormatDate(CURRENTDATE);
		let ValidationFailedData = [];
		let ValidationSuccessfulData = {};
		let ValidationFailedStatus = [];
		ValidationStatus = true;
		
		// LOOP EACH ITEM
		for (let Key in Data )
		{
			// LOOP EACH ITEM WITHIN OBJECT
			for (let Keys in Data[Key])
			{
				// BASE VARIABLES
				const RULE = Keys.toUpperCase();
				const INPUT = $('[data-validationcount="'+Key+'"]');
				const VALUE = INPUT.val();
				const ECODE = INPUT.attr('data-validationmessage');
				const FORMATED = FormatDate(VALUE);
				const STAGE = (RULE === 'PSTARTDATE' ? 1 : 2);
				const DIFF = DateDifference(DATE.F, FORMATED.F, STAGE);
				const OPTION = (INPUT.attr('data-validationoption') === undefined ? 0 : INPUT.attr('data-validationoption'));
				const OPTIONS = (OPTION === 0 ? false : ValidationOptions(OPTION));
			
				// VALIDATION VISUAL STATUS
				INPUT.css('border-bottom','');
				INPUT.next('.ValidationErrorMessage_Visual').remove();
			
				// VALIDATION RULE > P START DATE
				if(RULE === 'PSTARTDATE')
				{
					if (VALUE === "")
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
					}
					// BEFORE TODAY [DAYS < 0]
					else if (DIFF < 0)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '3');
					}
					// OVER 30 DAYS [DAYS > 30]
					else if (DIFF > 30)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '4');
					}
					// VALID DATE
					else
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
				}
				
				// VALIDATION RULE > AGE
				if(RULE === 'AGE')
				{
					let MinimumAge;
					let MaximumAge;
					let BirthdayCheck;
					
					if (OPTIONS.OPTION === 'CUSTOM OPTION 1' || OPTIONS.OPTION === 'C1')
					{
						MinimumAge = 23;
						MaximumAge = 75;
					}
					else if (OPTIONS.OPTION === 'CUSTOM OPTION 2' || OPTIONS.OPTION === 'C2')
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
					
					// AGE FALLS IN BETWEEN MIN & MAX
					if (DIFF.YEAR >= MinimumAge && DIFF.YEAR <= MaximumAge)
					{
						if (DIFF.YEAR === 16)
						{
							if (DIFF.DAY >= -14 && DIFF.DAY < 0)
							{				
								ValidationSuccessfulData[Key] = VALUE;
							}
							else
							{
								ValidationStatus = false;
								ValidationFailedData.push(Key);
								ValidationFailedStatus.push(ECODE || '7');
							}
						}
						else
						{
							ValidationSuccessfulData[Key] = VALUE;
						}
						
					}
					// AGE IS MORE THAN MAXIMUM
					else if (DIFF.YEAR > MaximumAge)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '5');
					}
					else
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '6');
					}
				}
				
				// VALIDATION RULE > REQUIRED
				if(RULE === 'REQUIRED')
				{
					if (VALUE !== "")
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
					else
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '8');
					}
				}
				
				// VALIDATION RULE > RANGE [DEFAULT]
				if (RULE === 'RANGE')
				{
					let MinimumRange;
					let MaximumRange;
					
					if (!OPTION)
					{
						MinimumRange = -1;
						MaximumRange = 50;
					}
					
					if (VALUE <= MinimumRange || VALUE >= MaximumRange)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '14');
					}
					else
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
				}
				
				// VALIDATION RULE > LOGIN > LOGIN CREDENTIAL
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
					}
				}
				
				// VALIDATION RULE > LOGIN > PASSWORD
				if(RULE === 'LOGINPASSWORD')
				{
					if(VALUE.length < 8)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '1');
					}
					else
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
				}
				
				// VALIDATION RULE > EMAIL
				if(RULE === 'EMAIL')
				{
					const SPLIT_EMAIL = (VALUE === '' ? false : VALUE.split('@').pop());
					const ADDITIONAL_OPTIONS = (OPTIONS.RULE === 'STANDARD' ? true : ValidateOptions(OPTIONS, SPLIT_EMAIL, RULE));
					
					if(/^(\w+|\d+)([\.\-!#$%&'*+\/=?^_`{|}~]?([a-z]|[0-9]))*@\w+([\.-]?\w+)*(\.\w{1,3})+$/i.exec(VALUE) === null)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '10');
					}
					// VALID EMAIL 
					else
					{
						if (!ADDITIONAL_OPTIONS)
						{
							ValidationStatus = false;
							ValidationFailedData.push(Key);
							ValidationFailedStatus.push(ECODE || '17');
						}
						else
						{
							ValidationSuccessfulData[Key] = VALUE;
						}
					}
				}
				
				// VALIDATION RULE > PHONE
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
					}
				}
				
				// VALIDATION RULE > PASSWORD
				if (RULE === 'PASSWORD')
				{
					if(VALUE.length < 8)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '1');
					}
					else
					{
						// UPPERCASE VALIDATION
						if (VALUE.replace(/[^A-Z]/g, "").length < 1)
						{
							ValidationStatus = false;
							ValidationFailedData.push(Key);
							ValidationFailedStatus.push(ECODE || '1');
						}
						else
						{
							ValidationSuccessfulData[Key] = VALUE;
						}
					}
				}
				
				// VALIDATION RULE > PASSWORD2 
				if (RULE === 'PASSWORD2')
				{
					if ($('[data-validation="Password"]').val() !== VALUE || $('[data-validation="Password"]').val() === '')
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || '2');
					}
					else
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
				}
				
				// VALIDATION RULE > POSTCODE/AREACODE
				if(RULE === 'POSTCODE')
				{
					const AREA = VALUE.split(' ').join('').slice(0, - 3);
					const SECTOR = VALUE.substr(VALUE.length - 3);
					const ADDITIONAL_OPTIONS = (OPTIONS.RULE === 'REGION' ? true : ValidateOptions(OPTIONS, AREA, RULE));
					const REGION = (OPTIONS.RULE === 'REGION' ? ValidateOptions(OPTIONS, 0, RULE) : 'GB');

					if(AreacodeValidation(VALUE, REGION))
					{
						if (!ADDITIONAL_OPTIONS)
						{
							ValidationStatus = false;
							ValidationFailedData.push(Key);
							ValidationFailedStatus.push(ECODE || '');
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
					}
				}
				
				// VALIDATION RULE > LOCATE
				if (RULE === 'LOCATE')
				{
					const FOUND = ValidateOptions(OPTIONS, 0, RULE)
					
					if (!FOUND)
					{
						alert(OPTIONS.OPTION+' has not been found!');
					}
					else
					{
						alert('Found '+FOUND+' occurance(s) of "'+OPTIONS.OPTION+'"');
					}
				}
				
			}
		}
			
		// DISPLAY ANY ERROR CASES
		for (let i = 0; i < ValidationFailedData.length; i += 1)
		{
			$('[data-validationcount="'+ValidationFailedData[i]+'"]').css('border-bottom', '2px solid red');
			$('[data-validationcount="'+ValidationFailedData[i]+'"]').after('<p class="ValidationErrorMessage_Visual">'+ValidationCodes(ValidationFailedStatus[i])+'</p>');
		}
		
		ValidationSuccessfulData = JSON.stringify(ValidationSuccessfulData);
		
		// RETURN STATUS
		let ValidationOutput = [ValidationStatus,ValidationFailedData,ValidationSuccessfulData];
		return ValidationOutput;
	}
	
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
			if (OPTIONS.OPTION)
			{
				for (let i = 0; i < OPTIONS.OPTION.length; i += 1)
				{
					ParameterFound = (OPTIONS.OPTION[i].toUpperCase().search(SEARCHABLE.toUpperCase()) > -1 ? Status = (true === Method) ? true : false : false);
				}
			}
		}
		// LOCATE ELEMENT PARAMETER PASSED
		else if (OPTIONS.RULE === 'FIND')
		{
			if (OPTIONS.OPTION)
			{
				for (let i = 0; i < OPTIONS.OPTION.length; i += 1)
				{
					ParameterFound = ($(OPTIONS.OPTION[i]).size() >= 1 ? Status = $(OPTIONS.OPTION[i]).size() : false);
				}
			}
		}
		// POSTCODE REGION VALIDATION
		else if (OPTIONS.RULE === 'REGION')
		{
			if (OPTIONS.OPTION)
			{
				Status = OPTIONS.OPTION;
			}
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
		else if (OPTION.search('FIND:') > -1 )
		{
			ValidationOptionRule = 'FIND';
			ValidationOptionsBreakdown = OPTION.split('FIND:').pop();
			ValidationOption = ValidationOptionsBreakdown.split(',');
		}
		// NO VALIDATION OPTIONAL RULE SET
		else if (!OPTION)
		{
			return false;
		}
		// VALIDATION OPTIONAL RULE SET BUT NOT FOUND
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
				ValidationStatus = 'Required Field - Highlighted Fields Must Be Completed';
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