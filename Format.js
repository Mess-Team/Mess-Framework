// GET CURRENT DATE AND FORMAT
function GetDate()
{
    // SET CURRENT DATE
    const DATE = new Date();
    const FORMATEDDATE = FormatDate(DATE);

    return FORMATEDDATE;
}

// FORMATED ANY PASSED DATE
function FormatDate(PASSEDDATE)
{
    // SET DATE VARIABLES
    const DATE = new Date(PASSEDDATE);
    const MONTH = DATE.getUTCMonth() + 1;
    const DAY = DATE.getUTCDate();
    const YEAR = DATE.getUTCFullYear();
    const FULL = MONTH + "/" + DAY + "/" + YEAR;
    const SECONDS = DATE.getTime() / 1000;
    
    // BUILD DATE ARRAY
    var FORMATEDDATE = {
        'F': FULL,
        'S': SECONDS,
        'Y': YEAR,
        'D': DAY,
        'M': MONTH
    };
    
    return FORMATEDDATE;
}