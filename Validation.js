// VALIDATION FUNCTION
function Validation(ValidationStatus, Data)
{
	// START VALIDATION
	if(ValidationStatus == '')
	{
		var ValidationStatus = true;
		var ValidationFailedData = [];
		var ValidationSuccessfulData = {};
		
		// SET CURRENT DATE > DATE VALIDATION
		var date = getDate();
	}
	
	
	// LOOP EACH ITEM
	for (var Key in Data )
	{
		// LOOP EACH ITEM WITHIN OBJECT
		for (var Keys in Data[Key])
		{
			$('[data-validation="'+Keys+'"]').css('border-bottom','1px solid green');
		
			// 		VALIDATION > DATES
		
			// IF CONTAINS PROCEEDINGDATE
			if('ProceedingDate' in Data[Key])
			{
				FormatedDate = FormatDate(Data[Key].ProceedingDate);
				
				// DATE IS EMPTY
				if (Data[Key].ProceedingDate == "")
				{
					ValidationStatus = false;
					ValidationFailedData.push(Keys);
				}
				// DATE IS BEFORE TODAY
				else if (DateDifference(date['F'], FormatedDate['F'], 1) < 0)
				{
					ValidationStatus = false;
					ValidationFailedData.push(Keys);
				}
				// DATE IS OVER 30 DAYS
				else if (DateDifference(date['F'], FormatedDate['F'], 1) > 30)
				{
					ValidationStatus = false;
					ValidationFailedData.push(Keys);
				}
				// DATE IS VALID
				else
				{
					ValidationSuccessfulData[Keys] = Data[Key].ProceedingDate;
				}
			}
			
			// IF CONTAINS AGE VALIDATION
			if('Age' in Data[Key])
			{
				// RUN FUNCTIONS > FORMATE DATE > DATE COMPARISON
				var FormatedDate = FormatDate(Data[Key].Age);
				var Difference = DateDifference(date['F'], FormatedDate['F'], 2);
				
				// AGE IS 17 OR HIGHER & 85 OR LOWER
				if (Difference['Y'] >= 17 && Difference['Y'] <= 85)
				{				
					ValidationSuccessfulData[Keys] = Data[Key].Age;
				}
				// AGE IS HIGHER THAN 85
				else if (Difference['Y'] > 85)
				{
					ValidationStatus = false;
					ValidationFailedData.push(Keys);
				}
				else
				{
					ValidationStatus = false;
					ValidationFailedData.push(Keys);
				}
			}
			
			// 		VALIDATION > REQUIRES
			
			// IF CONTAINS REQUIRED
			if('Required' in Data[Key])
			{
				if ($('[data-count="'+Key+'"]').attr('data-save') != "")
				{
					ValidationSuccessfulData[Key] = Data[Key].Required;
				}
				else
				{
					ValidationStatus = false;
					ValidationFailedData.push(Key);
				}
			}
	
			// 		VALIDATION > CREDENTIALS
			
			// IF CONTAINS EMAIL VALIDATION
			if('Email' in Data[Key])
			{
				// CHECK EMAIL IS VALID
				if(/^(\w+|\d+)([\.\-!#$%&'*+\/=?^_`{|}~]?([a-z]|[0-9]))*@\w+([\.-]?\w+)*(\.\w{1,3})+$/i.exec(Data[Key].Email) === null)
				{
					ValidationStatus = false;
					ValidationFailedData.push(Keys);
				}
				else
				{
					ValidationSuccessfulData[Keys] = Data[Key].Email;
				}
				
			}
			
			// IF PHONE VALIDATION
			if ('Phone' in Data[Key])
			{
				if(/^[0-9\'\- ]{11,13}$/i.exec(Data[Key].Phone) !== null)
				{
					ValidationSuccessfulData[Keys] = Data[Key].Phone;
				}
				else
				{
					ValidationStatus = false;
					ValidationFailedData.push(Keys);				
				}
			}
			
			// IF CONTAINS PASSSWORD VALIDATION
			if ('Password' in Data[Key])
			{
				// IF PASSWORD VALID
				if(Data[Key].Password.length < 8)
				{
					ValidationStatus = false;
					ValidationFailedData.push(Keys);
				}
				else
				{
					ValidationSuccessfulData[Keys] = Data[Key].Password;
				}
			}
			
			// IF CONTAINS PASSWORD CONFIRMATION VALIDATION
			if ('Password2' in Data[Key])
			{
				// PASSWORDS CALLED TO VALIDATE PASSWORDS ARE MATCHING
				var P = Key - 1; // WORK AROUND !!!!!!!!!!!!!!!!!
				var Password = Data[P].Password;
				var Password2 = Data[Key].Password2;
				
				if (Password != Password2 || Password == '')
				{
					ValidationStatus = false;
					ValidationFailedData.push(Keys);
				}
				else
				{
					ValidationSuccessfulData[Keys] = Data[Key].Password2;
				}
			}
			
			// IF CONTAINS POSTCODEUK VALIDATION
			if('Postcode' in Data[Key])
			{
				var Country = $('[data-validation="Postcode"]').attr('data-region');

				if(PostcodeValidation(Data[Key].PostcodeUK, Country))
				{
					ValidationSuccessfulData[Keys] = Data[Key].Postcode;
				}
				else
				{
					ValidationStatus = false;
					ValidationFailedData.push(Keys);
				}
			}
		}
	}
	
	
	// SHOW INVALID DATA
	for (i = 0; i < ValidationFailedData.length; ++i)
	{
		$('[data-validation="'+ValidationFailedData[i]+'"]').css('border-bottom','1px solid red');
		
		$('[data-count="'+ValidationFailedData[i]+'"]').css('border-bottom', '1px solid red');
	}
	
	// SUCCESSFUL DATA > JSON
	ValidationSuccessfulData = JSON.stringify(ValidationSuccessfulData);
	ValidationStatus = true;
	
	// RETURN STATUS
	var ValidationOutput = [ValidationStatus,ValidationFailedData,ValidationSuccessfulData];
	
	return ValidationOutput;
}

// DATE DIFFERENCE IN DAYS
function DateDifference(Date1, Date2, Type)
{
	d1 = new Date(Date1);
	d2 = new Date(Date2);
	
	// TYPE 1 > (DAYS) COMPARISON
	if (Type == 1)
	{
		return Math.floor((Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate()) - Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate()) ) / (1000 * 60 * 60 * 24));
	}
	// TYPE 2 > AGE CALCULATOR
	else if (Type == 2)
	{
		var YearDifference = d1.getFullYear() - d2.getFullYear();
		var MonthDifference = d1.getMonth() - d2.getMonth();
		var DayDifference = d1.getDate() - d2.getDate();
		
		// IF MONTH DIFFERENCE IS MINUS
		if (MonthDifference < 0)
		{
			// CONVERT NUMBER TO POSITIVE
			MonthDifference *= - 1;
			MonthDifference = 12 - MonthDifference;
			
			// REMOVE A YEAR OFF THE YEAR DIFFERENCE
			YearDifference = YearDifference - 1;
		}
		
		// FIX BIRTHDAY ISSUE IF DAY IS A MINUS VALUE
		if (DayDifference < 0)
		{
			YearDifference = YearDifference - 1;
		}
		
		return Difference = {
			'M': MonthDifference,
			'Y': YearDifference,
			'D': DayDifference
		};
	}
}

// VALIDATES PASSED POSTCODE
function PostcodeValidation(Postcode, Country) { 
	var PostcodeRegEx = new RegExp(AreacodeRegex(Country));
	console.log(PostcodeRegEx);
	return PostcodeRegEx.test(Postcode); 
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
	
	