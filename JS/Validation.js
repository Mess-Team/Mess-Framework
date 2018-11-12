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
		
			// VALIDATION > DATES
		
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
			
			// VALIDATION > REQUIRES
			
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
	
			// VALIDATION > CREDENTIALS
			
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
	
	