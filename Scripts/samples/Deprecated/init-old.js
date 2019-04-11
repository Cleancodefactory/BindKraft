/*	This is an old and unfinished example init.js. The API used here will work, but a new and better one is designed - please use the init.js example.


	Example/empty initialize module file.
	One such file must be included in the scripts directory in each Module. The file has to be included for loading!
	
	It is recommended to add this file, even if it is empty. This helps the developers to determine what the module registers with the system while loading.
 */
 
 // 1. Defaults
 /*
	Some modules carry design materials and change the behavior of cerain system classes. As a side note - be careful with this,
	because such modules can easilly cause conflicts when two or more of them dealing with the same classes are included. Each module
	will try to change system level settings and templates and the end result is unpredictable. Such modules are usually designed so that
	only one of a them can be used at a time! Good example is BindKraftStyles module.
  */
  
  // 1.Default templates
  // 1.1 Default templates of controls/components
  
  // Set the default template of a Control/Component class with one carried by this module
  // Class.defaultsOf(<ControlClassName>).set({ templateName: <TemplateStandardName> });
  // <ControlClassName> 	- the class name of the components
  // <TemplateStandardName> - These names are formed as <modulename>/<templatename>
  //							<modulename> - is the name of your module. It is possible to register template from another module, but this approach is discoraged
  //							<templatename> - the file name of the template file in the Templates folder of the module, without the file extension (usually .html).
  // example: Class.defaultsOf(PagerControl).set({ templateName: "bindkraftstyles/control-pager" });
  // example: Class.defaultsOf(CheckBoxControl).set({ templateName: "bindkraftstyles/control-checkbox" });
  
  // 1.2 Default templates ot windows
  // Class.defaultsOf(<WindowClassName>).set({ templateName: <TemplateStandardName> });
  
  // 2. CLScripts - command line scripts and global commands
  
  // 2.1 Global commands implemented in the module
  
  
  
  // 2.2 Boot time CLScripts.
  //	Modules carrying apps, utilities etc. may offer a number of CL scripts that initialize structures/classes and other elements while
  //	the system is initializing on the client (booting). There can be altenative scripts for one and the same purpose, for rarely needed features -
  //	no matter, they have to be put into the BootFS in order to make them callable from the master boot script of the system (which will choose
  //	what to call or not call and with what parameters).
  
  // System.BootFS().writeScript(<path>,<script>);
  //		<path> - string. For the BootFS it SHOULD be formed as <modulename>/<scriptname>. E.g. "MyModule/init"
  //		<script> - content of the boot time script. The commands used must be global ones.
  // example: System.BootFS().writeScript("mymodule/init","daemon start 'MyDaemonCls' maxclients 3 dropcontext");
  // It is normal to include alternatives and leave to the master boot to sourt out things.