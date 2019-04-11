// DEPRECATED - see boot scripts
/**
  *  Example boot loader
  */
  
(function () {
	var module = "$system"; // Change this to your booy module name
	var language = "en"; // Obtain this in some custom manner if neccessary
	
	// Helps to retrieve phases quickly
	var phase = $SysBoot.Default().phase;
	
	//$SysBoot.Default().action(phase.
	// Initialize culture support
	$SysBoot.Default().action(phase.runtime, module, function() {
		
	});
	
})();
  
