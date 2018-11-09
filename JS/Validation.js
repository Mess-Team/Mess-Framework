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
			var dateObject = new Date();
			var dateMonth = dateObject.getUTCMonth() + 1;
			var dateDay = dateObject.getUTCDate();
			var dateYear = dateObject.getUTCFullYear();
			var dateFull = dateMonth + "/" + dateDay + "/" + dateYear;
			var dateSeconds = dateObject.getTime() / 1000;
		}
		
		// LOOP EACH ITEM
		for (var Key in Data)
		{
			
			$('[data-tag="'+Key+'"]').css('border-bottom','1px solid green');
			
			// IF CONTAINS POLICYSTARTDATE
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
				else if (DateDifference(dateFull, FormatedDate['FullDate'], 1) < 0)
				{
					ValidationStatus = false;
					ValidationFailedData.push(Key);
				}
				// POLICY DATE IS VALID
				else
				{
					ValidationSuccessfulData[Key] = Data[Key].PolicyStartDate;
				}
			}
			
			// IF CONTAINS AGE
			if('Age' in Data[Key])
			{
				// RUN FUNCTIONS > FORMATE DATE > DATE COMPARISON
				var FormatedDate = ManipulateDate(Data[Key].Age);
				var Difference = DateDifference(dateFull, FormatedDate['FullDate'], 2);
				
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
			
			// IF CONTAINS REQUIRED
			if('Required' in Data[Key])
			{
				if ($('[data-tag="'+Key+'"]').val() != "")
				{
					ValidationSuccessfulData[Key] = Data[Key].SelectRequired;
				}
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
			
		}
		
		// IF DATA TAG IN FALSE VALIDATION ARRAY SHOW INVALID
		for (i = 0; i < ValidationFailedData.length; ++i)
		{
			$('[data-tag="'+ValidationFailedData[i]+'"]').css('border-bottom','1px solid red');
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
		// TYPE 3 > CHECK 2 WEEKS TILL BIRTHDAY (17TH)
		else if (Type == 3)
		{
		}
		
	}
	
	// DATE VALIDATION FUNCTION
	function ManipulateDate(PassedDate)
	{
		// SET DATE VARIABLES
		var dateObject = new Date(PassedDate);
		var dateMonth = dateObject.getUTCMonth() + 1;
		var dateDay = dateObject.getUTCDate();
		var dateYear = dateObject.getUTCFullYear();
		var dateFull = dateMonth + "/" + dateDay + "/" + dateYear;
		var dateSeconds = dateObject.getTime() / 1000;
		
		// BUILD DATE ARRAY
		var date = {
			'FullDate': dateFull,
			'Seconds': dateSeconds,
			'YearDate': dateYear,
			'DayDate': dateDay,
			'MonthDate': dateMonth
		};
		
		return date;
	}