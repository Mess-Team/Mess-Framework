// GET CURRENT DATE AND FORMAT
function getDate()
{
    // SET CURRENT DATE
    var dateObject = new Date();
    var FetchedDate = FormatDate(dateObject);

    return FetchedDate;
}

// FORMATED ANY PASSED DATE
function FormatDate(PassedDate)
{
    // SET DATE VARIABLES
    var dateObject = new Date(PassedDate);
    var Month = dateObject.getUTCMonth() + 1;
    var Day = dateObject.getUTCDate();
    var Year = dateObject.getUTCFullYear();
    var Full = Month + "/" + Day + "/" + Year;
    var Seconds = dateObject.getTime() / 1000;
    
    // BUILD DATE ARRAY
    var FormatedDate = {
        'F': Full,
        'S': Seconds,
        'Y': Year,
        'D': Day,
        'M': Month
    };
    
    return FormatedDate;
}