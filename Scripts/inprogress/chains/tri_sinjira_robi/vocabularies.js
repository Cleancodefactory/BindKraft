//=VOCABULARY FOR SYSTEM EVENTS
/*
var systemVoc= new Vocabulary("bk-reporting");

//eventlogs
systemVoc.addAspect(DataAspectBasicTypeEnum.ARRAY+"/criticalerrors");
systemVoc.addAspect(DataAspectBasicTypeEnum.ARRAY+"/errors");
systemVoc.addAspect(DataAspectBasicTypeEnum.ARRAY+"/warnings");
systemVoc.addAspect(DataAspectBasicTypeEnum.ARRAY+"/notices");
systemVoc.addAspect(DataAspectBasicTypeEnum.ARRAY+"/successes");

//event reporter reference
systemVoc.addAspect(DataAspectBasicTypeEnum.REFER+"/eventreporter");
*/

//=VOCABULARY FOR THE HTTP REQUEST/RESPONSE
var httpVoc= new Vocabulary("bk-http");

//REQUEST

httpVoc.addAspect(DataAspectBasicTypeEnum.TEXT+"/request-url");
httpVoc.addAspect(DataAspectBasicTypeEnum.TEXTURL+"/request-urlstring");//encoded with the query params

//headers and query params
httpVoc.addAspect(DataAspectBasicTypeEnum.ASSOC+"/request-query-params");
httpVoc.addAspect(DataAspectBasicTypeEnum.ASSOC+"/request-headers");

//body as text
httpVoc.addAspect(DataAspectBasicTypeEnum.TEXT+"/request-body");
httpVoc.addAspect(DataAspectBasicTypeEnum.TEXTJSON+"/request-body");
httpVoc.addAspect(DataAspectBasicTypeEnum.TEXTXML+"/request-body");
httpVoc.addAspect(DataAspectBasicTypeEnum.TEXTHTML+"/request-body");

//body as structured data
httpVoc.addAspect(DataAspectBasicTypeEnum.XDOCUMENT+"/request-body");
httpVoc.addAspect(DataAspectBasicTypeEnum.HTMLFRAG+"/request-body");
httpVoc.addAspect(DataAspectBasicTypeEnum.OBJECT+"/request-body");

//RESPONSE
httpVoc.addAspect(DataAspectBasicTypeEnum.ASSOC+"/response-headers");

//status
httpVoc.addAspect(DataAspectBasicTypeEnum.ASSOC+"/response-status");

//body as text
httpVoc.addAspect(DataAspectBasicTypeEnum.TEXT+"/response-body");
httpVoc.addAspect(DataAspectBasicTypeEnum.TEXTJSON+"/response-body");
httpVoc.addAspect(DataAspectBasicTypeEnum.TEXTXML+"/response-body");
httpVoc.addAspect(DataAspectBasicTypeEnum.TEXTHTML+"/response-body");

//body as structured data
httpVoc.addAspect(DataAspectBasicTypeEnum.XDOCUMENT+"/response-body");
httpVoc.addAspect(DataAspectBasicTypeEnum.HTMLFRAG+"/response-body");
httpVoc.addAspect(DataAspectBasicTypeEnum.OBJECT+"/response-body");

//the request body can be of type:
//* A Document, in which case it is serialized before being sent.
//* A BodyInit, which as per the Fetch spec can be a Blob, BufferSource, FormData, URLSearchParams, ReadableStream, or USVString object.

//XHR
httpVoc.addAspect(DataAspectBasicTypeEnum.REFER+"/xhr-instance");//xhr ref
httpVoc.addAspect(DataAspectBasicTypeEnum.ASSOC+"/xhr-options");//xhr-options: method, async, timeout, user, password, cachecntrl (used in open) //cache-control should be neglected for now
//httpVoc.addAspect(DataAspectBasicTypeEnum.OBJECT+"/xhr-fields");//custom xhr fields - meaningless in this context