	// VALIDATION FUNCTION
	function Validation(ValidationStatus, Data)
	{
		// START VALIDATION
		if(ValidationStatus == '')
		{
			var ValidationStatus = true;
			var ValidationFailedData = [];
			var ValidationSuccessfulData = {};
			var ValidationFailedStatus = [];
			
			// SET CURRENT DATE & FORMAT
			var CurrentDate = new Date();
			var D = FormatDate(CurrentDate);
		}
		
		// LOOP EACH ITEM
		for (var Key in Data )
		{
			// LOOP EACH ITEM WITHIN OBJECT
			for (var Keys in Data[Key])
			{
				// PASSED OPTIONAL VARIABLES
				var RULE = Keys;
				var INPUT = $('[data-validationcount="'+Key+'"]');
				var VALUE = INPUT.val();
				var ECODE = INPUT.attr('data-validationmessage'); // OR 'DEFAULT';
				var OPTION = INPUT.attr('data-validationoption'); // OR 'DEFAULT';
				
				// SET VALIDATION VISUAL STATUS
				INPUT.css('border-bottom','');
				INPUT.next('.ValidationErrorMessage_Visual').hide();
			
				// IF CONTAINS PROCEEDINGDATE
				if('ProceedingDate' in Data[Key])
				{
					FD = FormatDate(VALUE);
					if (VALUE == "")
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
					}
					// DATE IS BEFORE TODAY
					else if (DateDifference(D['F'], FD['F'], 1) < 0)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || 3);
					}
					// DATE IS OVER 30 DAYS
					else if (DateDifference(D['F'], FD['F'], 1) > 30)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || 4);
					}
					// DATE IS VALID
					else
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
				}
				
				// IF CONTAINS AGE VALIDATION
				if('Age' in Data[Key])
				{
					// FORMAT DATE & GET DIFFERENCE
					var FD = FormatDate(VALUE);
					var DD = DateDifference(D['F'], FD['F'], 2);
					
					// AGE IS 17 OR HIGHER & 85 OR LOWER
					if (DD['Y'] >= 17 && DD['Y'] <= 85)
					{				
						ValidationSuccessfulData[Key] = VALUE;
					}
					// AGE IS HIGHER THAN 85
					else if (DD['Y'] > 85)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || 5);
					}
					else
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || 6);
					}
				}
			
				// IF CONTAINS AGE 16
				if ('Age16' in Data[Key])
				{
					// FORMAT DATE & GET DIFFERENCE
					var FD = FormatDate(VALUE);
					var DD = DateDifference(D['F'], FD['F'], 2);
					
					// 17 WITHIN 2 WEEKS
					if (DD['Y'] == 16 && DD['D'] >= -14 && DD['D'] < 0)
					{				
						ValidationSuccessfulData[Key] = VALUE;
					}
					// NOT 17 WITHIN 2 WEEKS
					else
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || 7);
					}
				}
				
				//		VALIDATION > REQUIRES
				
				// IF CONTAINS REQUIRED
				if('Required' in Data[Key])
				{
					if (VALUE != "")
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
					else
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || 8);
					}
				}
				
				// [>TEMPLATE<] RANGE INPUT VALIDATION
				if ('Range' in Data[Key])
				{
					if (VALUE < OPTION || 10)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || 14);
					}
					else
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
				}
				
				//		VALIDATION > CREDENTIALS
				
				// LOGIN > IF CONTAINS CREDENTAIL
				if('LoginCredential' in Data[Key])
				{
					// EMAIL ADDRESS LOGIN
					if(/^(\w+|\d+)([\.\-!#$%&'*+\/=?^_`{|}~]?([a-z]|[0-9]))*@\w+([\.-]?\w+)*(\.\w{1,3})+$/i.exec(VALUE) !== null)
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
					// ELSE IF PHONE LOGIN
					else if(/^[0-9\'\- ]{11,13}$/i.exec(VALUE) !== null)
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
					else
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);	
						ValidationFailedStatus.push(ECODE || 9);						
					}
				}
				
				// LOGIN > IF CONTAINS PASSWORD
				if('LoginPassword' in Data[Key])
				{
					// IF PASSWORD VALID
					if(VALUE.length < 8)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || 1);
					}
					else
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
					
				}
				
				// IF CONTAINS EMAIL VALIDATION
				if('Email' in Data[Key])
				{
					if(/^(\w+|\d+)([\.\-!#$%&'*+\/=?^_`{|}~]?([a-z]|[0-9]))*@\w+([\.-]?\w+)*(\.\w{1,3})+$/i.exec(VALUE) === null)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || 10);
					}
					else
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
				}
				
				// IF CONTAINS PHONE VALIDATION
				if ('Phone' in Data[Key])
				{
					if(/^[0-9\'\- ]{11,13}$/i.exec(VALUE) !== null)
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
					else
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);	
						ValidationFailedStatus.push(ECODE || 11);						
					}
				}
				
				// IF CONTAINS PASSSWORD VALIDATION
				if ('Password' in Data[Key])
				{
					// CHECK PASSWORD LENGTH MINIMUN 8 CHARACTERS
					if(VALUE.length < 8)
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || 1);
					}
					else
					{
						// CHECK PASSWORD CONTAINS 1+ UPPER CASE CHARACTERS
						if (VALUE.replace(/[^A-Z]/g, "").length < 1)
						{
							ValidationStatus = false;
							ValidationFailedData.push(Key);
							ValidationFailedStatus.push(ECODE || 1);
						}
						else
						{
							ValidationSuccessfulData[Key] = VALUE;
						}
					}
				}
				
				// IF CONTAINS PASSWORD CONFIRMATION VALIDATION
				if ('Password2' in Data[Key])
				{
					// PASSWORDS CALLED TO VALIDATE PASSWORDS ARE MATCHING
					var Password = $('[data-validation="Password"]').val();
					
					if (Password != VALUE || Password == '')
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || 2);
					}
					else
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
				}
				
				// IF CONTAINS POSTCODE VALIDATION
				if('Postcode' in Data[Key])
				{
					if(PostcodeValidation(VALUE, OPTION || 'GB'))
					{
						ValidationSuccessfulData[Key] = VALUE;
					}
					else
					{
						ValidationStatus = false;
						ValidationFailedData.push(Key);
						ValidationFailedStatus.push(ECODE || 13);
					}
				}
			}
		}
			
		// IF DATA TAG IN FALSE VALIDATION ARRAY SHOW INVALID
		for (i = 0; i < ValidationFailedData.length; i++)
		{
			$('[data-validationcount="'+ValidationFailedData[i]+'"]').css('border-bottom', '2px solid red');
			
			$('[data-validationcount="'+ValidationFailedData[i]+'"]').after('<p class="ValidationErrorMessage_Visual">'+ValidationErrorCodes(ValidationFailedStatus[i])+'</p>');
		}
		
		ValidationSuccessfulData = JSON.stringify(ValidationSuccessfulData);
		ValidationStatus = true;
		
		// RETURN STATUS
		var ValidationOutput = [ValidationStatus,ValidationFailedData,ValidationSuccessfulData];
		return ValidationOutput;
	}
	
	// VALIDATES POSTCODE
	function PostcodeValidation(...P) { 
		var PostcodeRegEx = new RegExp(AreacodeRegex(P[1]));
		return PostcodeRegEx.test(P[0]); 
	}
	
	// VALIDATION ERROR CODES
	function ValidationErrorCodes(ValidationCode)
	{
		switch(ValidationCode)
		{
			case (1 || '1'):
				ValidationStatus = 'Password Must Contain at least <b>8</b> Characters and <b>1</b> Capital Letter';
				break;
				
			case (2 || '2'):
				ValidationStatus = 'Passwords do not match';
				break;
				
			case (3 || '3'):
				ValidationStatus = 'Policy Start Date Cannot Have a Date Previous to Today';
				break;
				
			case (4 || '4'):
				ValidationStatus = 'Policy Start Date Cannot be Over <b>30 Days</b>';
				break;
				
			case (5 || '5'):
				ValidationStatus = 'Invalid Cilent Age - Cilent Cannot be over <b>85</b>';
				break;
				
			case (6 || '6'):
				ValidationStatus = 'Invalid Cilent Age - Cilent Cannot be under <b>17</b>';
				break;
				
			case (7 || '7'):
				ValidationStatus = 'Invalid Cilent Age - Cilent is 16 & More Than 2 Weeks Until Birthday';
				break;
				
			case (8 || '8'):
				ValidationStatus = 'Required Field - Highlighted Fields Must Be Completed';
				break;
				
			case (9 || '9'):
				ValidationStatus = 'Email Address or Phone Number Not Recognized';
				break;
				
			case (10 || '10'):
				ValidationStatus = 'Please Enter a Valid Email Address';
				break;
				
			case (11 || '11'):
				ValidationStatus = 'Please Enter a Valid Phone Number';
				break;
				
			case (12 || '12'):
				ValidationStatus = 'Please Enter a Valid Landline Number';
				break;
				
			case (13 || '13'):
				ValidationStatus = 'Please Enter a <b>Valid</b> Postcode';
				break;
				
			case (14 || '14'):
				ValidationStatus = 'Please Select a Value Higher than 10';
				break;
				
			case (15 || '15'):
				ValidationStatus = 'Example Custom Error Message';
				break;
		}
		
		return ValidationStatus;
	}
	
	// REGEX COUNTRY AREA CODES
	function AreacodeRegex(Country)
	{
		AreacodeRegexArray = {

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