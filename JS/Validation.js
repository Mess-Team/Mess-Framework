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
	for (var Key in Data)
	{
		
		$('[data-validation="'+Key+'"]').css('border-bottom','1px solid green');
		
		// VALIDATION > DATES

		// IF CONTAINS PROCEEDING DATE
		if('ProceedingDate' in Data[Key])
		{
			FormatedDate = ManipulateDate(Data[Key].ProceedingDate);
			
			// DATE IS EMPTY
			if (Data[Key].ProceedingDate == "")
			{
				ValidationStatus = false;
				ValidationFailedData.push(Key);
			}
			// IS BEFORE TODAY
			else if (DateDifference(date['F'], FormatedDate['F'], 1) < 0)
			{
				ValidationStatus = false;
				ValidationFailedData.push(Key);
			}
			// DATE IS VALID
			else
			{
				ValidationSuccessfulData[Key] = Data[Key].ProceedingDate;
			}
		}
		
		// IF CONTAINS AGE
		if('Age' in Data[Key])
		{
			// RUN FUNCTIONS > FORMATE DATE > DATE COMPARISON
			var FormatedDate = ManipulateDate(Data[Key].Age);
			var Difference = DateDifference(date['F'], FormatedDate['F'], 2);
			
			// AGE IS 17 OR HIGHER & 85 OR LOWER
			if (Difference['Y'] >= 17 && Difference['Y'] <= 85)
			{				
				ValidationSuccessfulData[Key] = Data[Key].Age;
			}
			// AGE IS HIGHER THAN 85
			else if (Difference['Y'] > 85)
			{
				ValidationStatus = false;
				ValidationFailedData.push(Key);
			}
			else
			{
				ValidationStatus = false;
				ValidationFailedData.push(Key);
			}
		}
		
		// VALIDATION > SETTINGS

		// IF CONTAINS REQUIRED !!!!!!!!!
		if('Required' in Data[Key])
		{
			if ($('[data-validation="'+Key+'"]').val() != "")
			{
				ValidationSuccessfulData[Key] = Data[Key].SelectRequired;
			}
			else
			{
				ValidationStatus = false;
				ValidationFailedData.push(Key);
			}
		}

		// VALIDATION > CREDENTIALS	
		
		// IF CONTAINS PASSWORD VALIDATION
		if ('Password' in Data[Key])
		{
			// PASSWORD 8 OR MORE CHARACTERS
			if (Data[Key].Password.length >= 8)
			{
				// CHECK PASSWORD CONTAINS CAPITAL LETTER
				if (Data[Key].Password.replace(/[^A-Z]/g, "").length >= 1)
				{
					ValidationSuccessfulData[Key] = Data[Key].Password
				}
				// PASSWORD DOESN'T CONTAIN CAPITAL LETTER
				else
				{
					ValidationStatus = false;
					ValidationFailedData.push(Key);
				}
			}
			// PASSWORD IS LESS THAN 8 CHARACTERS
			else
			{
				ValidationStatus = false;
				ValidationFailedData.push(Key);
			}
		}

		// IF CONTAINS PASSWORD VARIFICATION
		if ('Password_Confirmation' in Data[Key])
		{
			// CHECK PASSWORD AND CONFIRMATION PASSWORD MATCH
			if (Data[Key].Password === Data[Key].Password_Confirmation)
			{
				ValidationSuccessfulData[Key] = Data[Key].Password_Confirmation;
			}
			// PASSWORDS DO NOT MATCH
			else
			{
				ValidationStatus = false;
				ValidationFailedData.push(Key);
			}
		}

		// IF CONTAINS EMAIL VALIDATION
		if('Email' in Data[Key])
		{
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			var ValidationCheck =  re.test(Data[Key].Email);
			
			// IF EMAIL IS VALID
			if (ValidationCheck)
			{
				ValidationSuccessfulData[Key] = Data[Key].Email;
			}
			// EMAIL IS NOT VALID
			else
			{
				ValidationStatus = false;
				ValidationFailedData.push(Key);
			}
		}

		// IF CONTAINS PHONE VALIDATION
		if ('Phone' in Data[Key])
		{

		}

		// IF CONTAINS POSTCODE VALIDATION
		if ('Postcode' in Data[Key])
		{

		}
		
	}
	
	// IF DATA TAG IN FALSE VALIDATION ARRAY SHOW INVALID !!!!!!
	for (i = 0; i < ValidationFailedData.length; ++i)
	{
		$('[data-validation="'+ValidationFailedData[i]+'"]').css('border-bottom','1px solid red');
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
	
	