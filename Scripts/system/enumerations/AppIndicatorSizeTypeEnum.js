/**
	Size "small" should be considered default as it will most likely make the indicator usable, albeit ugly, in every other size 
	if they are not specially implemented.
*/
var AppIndicatorSizeTypeEnum = {
	small: "small", // Small square sized - AxA where A is prefereably 16pt <= A <= 24pt
	normal: "normal", // Normal square sized - AxA whre A is around 32pt up to 48pt
	wide: "wide", // Target size about 24pt x 48pt to 32pt x 64pt
	large: "large", // Target size about 64pt x 64pt and up (may be up to 80pt x 80pt)
};