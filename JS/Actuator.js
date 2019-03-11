// SETUP
$('input, select, textarea, span[type="switch"], button[data-output]').each(function(Event){ 
	Controller(this, Event); 
});

// TRIGGER
$('input, select, textarea, span[type="switch"], button, .dialogArea').on('click keyup keydown change', function(Event){
	Controller(this, Event);
});