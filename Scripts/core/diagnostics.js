JBUtil.referenceObjCount=function(obj){var className=obj.classType();if(className==null){CompileTime.notice("Created instance with undetermined type: "+obj+" "+className+"\n");}else{if(typeof DIAGNOSTICS.all[className]=="undefined"){DIAGNOSTICS.all[className]=0;}DIAGNOSTICS.all[className]++;}DIAGNOSTICS.totalCounter++;};JBUtil.referenceObjCountRem=function(obj){var className=obj.classType();if(className==null){CompileTime.notice("Created instance with undetermined type: "+obj+" "+className+"\n");}else{DIAGNOSTICS.all[className]--;}DIAGNOSTICS.totalCounter--;};