/*
	bkconfig.js - must be included before the framework files (before core/configuration.js)
	
	This file contains a number of global constant values honored by BindKraftJS. They tune various aspects of its behavior - from
	logging to behavior of whole subsystems.
	
	Have in mind that some features are included as means to put your code under pressure and are not ment to be used in production environment, but
	only in development time testing scenarios.
	
	Remove/comment out all the settings you do not want to change - the example is maintained with the defaults of the framework and they do not need to
	be specified here.
*/


var JBCoreConstants = {
		/*
			Enforces a number of checks for defined types - duplicate type names, method names (when implementing interfaces) etc. 
			Will throw exceptions (not all at once). 
		*/
		CheckTypeDuplicates: false,
		/*
			The resolution of the system event pump in milliseconds. This affects features like:
			- callAsync/async - asynchronous method execution
			- data-async attribute - asynchronous binding, updateTargets etc.
			- async window messages - posted messages (still rarely used at this moment).
			- derived features - features internally based on the ones mentioned above - Operation timeouts for instance.
			
			Recommended range: 
				20 - 50
					for deployments that include code that spawns high number of tasks (abundant usage of data-async, heavy costom usage of operations with
					timeouts, a lot of animation (visual or functional) based on async/callAsync
				25 - 100
					for deployments with occassional usage of async techniques. Pay special attention to data-async - if it is rare and in big chuncks with 
					little nesting this the value can be higher than 50. If there are no async based animations you can rise the value, but if there are any
					don't go over 50 to keep the user experience intact.
				25-35
					Recommended for general purposes
			
		*/
		SystemSchedulerFreq: 25,
		/*
			How long will tasks internally created in response to usage of data-async attribute will wait to be executed (in milliseconds).
			Big views may be slow to render and usage of data-async attribute can keep the browser responsive while they render. This has its costs - 
			the rendering is further slowed (it is important to find the balance).
			Such problems can be solved in various ways, the solutions always include splitting the big monolithic views in some manner (pop-up parts,
			collapsing parts rendered on demand, splitting the view into many - shown in separate BindKraft windows and so on). Still, there are cases when
			the end users prefer very long views anyway and then using data-async may be the only way to go. 
			
			This attribute causes the system to schedule as async tasks data updates, binding parsing and other work. Adjusting this setting prevents the
			cases when this goes way too far. In theory one should try to avoid such situations and carefuly adjust the data-async attributes, but nothing stops
			your users from opening and closing in quick succession some of your heaviest views (if you can find a way to prevent that with the UI design in an 
			unobtrusive fashion - do it). So, this is the maximum age of these small tasks - if they take longer than that (in milliseconds) they are deleted without
			executing them. The side effects are that some views may remain unfinished, not fully updated etc.
			
			Recommended valu 120000 (2 minutes)
				Such a limit is in almost all cases just a precaution for excessive numbers of tasks if it happend to be possible by mistake. Lower values may 
				cause problems.
		*/
		ClientViewTasksMaxAge: 120000, 
		/*
			For the pagers (and similar controls working with data areas) which support normalization of the data area pos. sets the normalization mode.
		*/
		PagersAutoNormalize: false, 
		/*
			1.4.3: Reverses the update sources to update from leaf-to-root. This will NOT (EVER!) become default in future versions.
			Why? Because one of the features we need is the ability of the bindings to literally create data structures and these need to grow from roots.
		*/
		ReverseSources: false, 
		/*
			Recommended to turn off this in production (it costs performance), but keep it on in dev. envs.
			Usage of ICustomParameterizationStdImpl or manual implementation of ICustomParameterization is recommended. It prevents unsupported parameters from
			corrupting data-class instances by design and are natural. StrictParameters uses whatever metainformation to check if something is indeed intended to be
			specified as a parameter, which is not only slow, but also will not always work (depending on how much metainfo can be collected).
		*/
		StrictParameters: false,
		/*
			Log the CompileTime messages to the browser's console.
			The messages still go into the internal buffer and can be read by log managers/senders, but are not listed in the console automatically.
			Recommended: true in dev time and false in production
		*/
		CompileTimeConsoleLog: true,
		/*
			Number of log entries in the buffer (to enable viewing), deploy recommended: 50-100
			The CompileTime logger logs to a buffer and alos informs subscribers when a log message is added. The buffer is needed for later
			reporting, viewing tools and alike. To preserve memory it can be limited and 50-100 is the minimal size recommended if some kind of
			reporting/remote reporting is involved. The assumptions are that the unneeded messages are suppressed in production env. (see LogTypes) and
			only a few non-important messages are logged. So the sensible size for the buffer is one that will allow potential errors and notices to fit 
			into the buffer without overflowing it, so that the reporting/remote reporting can pick them later.
			
			These log messages are almost exclusively generated by the system - make sure developers do not use the CompileTime logger to keep this so.
		*/
		CompileTimeLogSize: 1000,
		/*
			Which kinds of log entries to accept and which to ignore (true/false). The ignored entries will not be pushed to the buffer at all - i.e.
			this will not only limit the notifications to log subscribers, but will ignore these entries entirely.
		*/
		LogTypes: {					// Which kind of messages to log (CompileTime console logger honors this, the others should too)
					log: false,
					warn: true,
					err: true,
					info: false,
					notice:true,
					trace:false
				},
		/*
			If false (default) compile time errors will be logged, but will not cause exceptions. Continuing after a compile time error may lead to unpreictable results,
			but is often more convenient during development. However, in production it is probably better to set this to true.
			There is an idea to go even further in future and add a setting that will cause BindKraft to stop working alltogether after a compile time error.
		*/
		CompileTimeThrowOnErrors: false,
		/*
			Set to true to collect diagnostics (num instancies created for example).
		*/
		CollectDiagnostics: false
	};