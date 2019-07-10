/**
	Error codes for LASTERROR, errors transferred through Operations (where applicable) and so on.
	
	The Error code structure is as follows:
	
	24 bit field from 0 to 23, the rest are for now reserved and should be always zeros
	
	20-23  Facility
			0 - Reserved (due to the fact that all zeros are treated as NO_ERROR)
			1 - General - All non-systemized
			E - Foreign operations (e.g. RequestInterface based remoting). File: ForeignCodes.js
	1-19	Depends on the Facility - see the corresponding file
	0		Failure(1)/Success(0) (can be included in files for any facility for convenience)
	
	This file containes only facility General
	
	The subfield codes below are specified together with the Facility code to enable eaier manual composition, but when error composition routines are used, they will filter them through the masks
*/
var GeneralCodesFlags = {
	Facility_General: 0x100000,
	
	// General 1-bit (0-bit)
	Ok:			0x100000,
	Success:	0x100000,
	Failure:	0x100001,
	Failure_Mask: 0x000001,
	
	// Reserved 3-bits (1-3) Unused for the moment - should be 0
	
	
	// Kind 4-bits (4-7) - a generalized kind
	Kind_Mask:		0x0000F0,
	General:  		0x100000, // General error (no specific kind can be specified)
	NotFound:  		0x100010, // Something assumed/addressed/searched is not found.
	NotAllowed: 	0x100020, // Operation/task/execution (but NOT argument(s) type/content) is not allowed because of the state of the "where" part.
	Argument:		0x100030, // Argument(s) cause problems are not acceptable/serializable etc.
	NotAvailable:	0x100040, // A required service/component/protocol is not available at this time or permanently. Only active components, resources are NotFound
	Pending:		0x100060, // This is reported as an error to make sure that callers not capable of waiting will treat it as an error, but others will know
									// to wait (currently not used)
	AccessDenied:	0x100050, // Access was denied to a resource/service/component at the specified layer.
	Format:			0x100070, // Format of a structure is incorrect.
	
	// Code 12-bits (8-19)
	Code_Mask:		0x0FFF00
};