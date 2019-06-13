/*
	This file contains the "abstract" base classes for proxies and stubs.
	Base classes are used instead of interfaces, because the latter can be easilly implemented by mistake by wrong classes,
	while inheriting a class is a more noticable action - one unlikely to be done without consideration.
*/

function $Root_BaseProxy() {
	BaseObject.apply(this, arguments);
}
$Root_BaseProxy.Inherit(BaseObject,"$Root_BaseProxy");