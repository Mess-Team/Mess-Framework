// FORMS > SET DATA SAVE VALUE
$('input textarea select').each(function()
{
    $(this).attr('data-save', $(this).val());
});