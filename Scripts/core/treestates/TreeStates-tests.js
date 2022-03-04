// Keep this file for the time being.
// It is used for development purposes.



/*
	Test file included only manually or through tests profile (if exists)
	These are not systematic tests, but only for use during development 
*/

/*
//// Example for tests
g_cond1to20 = TreeStatesConvert.Condition("range",0,20);
g_cond21to40 = TreeStatesConvert.Condition("range",21,40);
g_condAlphaA = TreeStatesConvert.Condition("regex",/^A[a-zA-Z]+$/);
g_condAlphaB = TreeStatesConvert.Condition("regex",/^B[a-zA-Z]+$/);

g_ExampleTSE1 = [
	[ "alpha", "num,null", [g_cond1to20] ],
	[ "beta", "string",[g_condAlphaA]]
	//{ name: "alpha", myprop: 213}
];
g_ExampleTSE2 = [
	[ "alpha", "num,null", [g_cond21to40] ],
	[ "beta", "string"]
];
g_ExampleTSE21 = [
	[ "gamma", "string,null", [g_condAlphaB] ]
];

g_ExampleTSM = [
	[ [g_ExampleTSE1]
	],
	[ [g_ExampleTSE2],
	  [ [g_ExampleTSE21]
	  ]
	]
];
*/

var TreeStates = Class("TreeStates");

/*
app.js
app-tree.js
(function() {
	var app = Class....
	app.map = new TreeStates ....
})();

MyApp.prototype.map = new TreeStates ....
MyApp.map =

Module.dep
....
using treestates.js
using init.js
*/

var map1 = new TreeStates(function(maps, map, element, unit, condition) {
	return map( 
		element( "nodeA",
			unit("a","string",condition("regex",/^[a-zA-Z]+$/)),
			{ meta: "a"}
		),
		map(
			element("nodeAB",
				unit("b","num,string",
					condition("range",0,1000),
					condition("regex",/^[a-zA-Z]{2,4}$/)
				),
				{ meta: "b" }
			),
			map(
				element( "nodeABC",
					unit("o","num",
						condition("range",20,80)
					),
					unit("p","string",
						condition("regex",/^[a-z]+$/)
					),
					{ meta: "XXX" }
				)	
			)
		),
		map(
			element( "nodeAC",
				unit("b","num",
					condition("range",1001)
				),
				{ meta: "c" }
			)
		)
	);
});