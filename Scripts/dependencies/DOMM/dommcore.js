(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",


	whitespace = "[\\x20\\t\\r\\n\\f]",

	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		"*([*^$|!~]?=)" + whitespace +
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		".*" +
		")\\)|)",

	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		return "\\" + ch;
	},

	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);

try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		function( target, els ) {
			var j = target.length,
				i = 0;
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		nodeType = context ? context.nodeType : 9;

	results = results || [];

	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				if ( (m = match[1]) ) {

					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					} else {

						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			if ( support.qsa &&
				!nonnativeSelectorCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
						nonnativeSelectorCache( selector );
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

function createCache() {
	var keys = [];

	function cache( key, value ) {
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		el = null;
	}
}

function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	if ( diff ) {
		return diff;
	}

	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

function createDisabledPseudo( disabled ) {

	return function( elem ) {

		if ( "form" in elem ) {

			if ( elem.parentNode && elem.disabled === false ) {

				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				return elem.isDisabled === disabled ||

					elem.isDisabled !== !disabled &&
						inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		return false;
	};
}

function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

support = Sizzle.support = {};

isXML = Sizzle.isXML = function( elem ) {
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}


	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});


	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};



	rbuggyMatches = [];

	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		assert(function( el ) {
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			support.disconnectedMatch = matches.call( el, "*" );

			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	hasCompare = rnative.test( docElem.compareDocumentPosition );

	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};


	sortOrder = hasCompare ?
	function( a, b ) {

		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			1;

		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			siblingCheck( ap[i], bp[i] ) :

			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			if ( ret || support.disconnectedMatch ||
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {
			nonnativeSelectorCache( expr );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	sortInput = null;

	return results;
};

getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		while ( (node = elem[i++]) ) {
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}

	return ret;
};

Expr = Sizzle.selectors = {

	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			} else if ( unquoted && rpseudo.test( unquoted ) &&
				(excess = tokenize( unquoted, true )) &&
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						if ( forward && useCache ) {


							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							if ( useCache ) {
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							if ( diff === false ) {
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			if ( fn[ expando ] ) {
				return fn( argument );
			}

			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		"not": markFunction(function( selector ) {
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		"lang": markFunction( function( lang ) {
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		"empty": function( elem ) {
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							uniqueCache[ key ] = newCache;

							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					[] :

					results :
				matcherIn;

		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			if ( matcher[ expando ] ) {
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				if ( bySet ) {
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			matchedCount += i;

			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					setMatched = condense( setMatched );
				}

				push.apply( results, setMatched );

				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match  ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		cached.selector = selector;
	}
	return cached;
};

select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	if ( match.length === 1 ) {

		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};


support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

support.detectDuplicates = !!hasDuplicate;

setDocument();

support.sortDetached = assert(function( el ) {
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

var _sizzle = window.Sizzle;

Sizzle.noConflict = function() {
	if ( window.Sizzle === Sizzle ) {
		window.Sizzle = _sizzle;
	}

	return Sizzle;
};

if ( typeof define === "function" && define.amd ) {
	define(function() { return Sizzle; });
} else if ( typeof module !== "undefined" && module.exports ) {
	module.exports = Sizzle;
} else {
	window.Sizzle = Sizzle;
}

})( window );



Function.prototype.inherits = function(superCtor){
    this.prototype = Object.create(superCtor.prototype);
    this.prototype.base = superCtor;
    this.prototype.constructor = this;

    return this;
};

Object.Extend = function(obj, source) {
	for (var prop in source) {
	  obj[prop] = Object.Copy(source[prop]);
	}

		return obj;
};

Object.Copy = function(obj) {
  if (!typeof obj === 'object') return obj;
  return (Array.IsArray(obj)) ? obj.slice() : Object.Extend({}, obj);
};

Object.Clone= function(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}


var ImmutableBase= function(){
	this._isImmutable = true;
};

ImmutableBase.IsImmutable= function(obj){
	return (obj.hasOwnProperty("_isImmutable")) ? obj._isImmutable : false;
};

ImmutableBase.prototype.clone= function(){
	return Object.Copy(this);
};


var ImmutableCollection= function(arr){
	ImmutableBase.call(this);

	var isArr = Array.isArray(arr)
	if(!isArr) arr = [];

	for(var itt= 0; itt< arr.length; itt++){
		this[itt] = arr[itt];
	}

	this.length = arr.length;
};

ImmutableCollection.inherits(ImmutableBase);

ImmutableCollection.prototype.slice = Array.prototype.slice;
ImmutableCollection.prototype.join = Array.prototype.join;

ImmutableCollection.prototype.push = function (obj) {
	var clonned_arr = this.slice();
	clonned_arr.push(obj);

	return new this.constructor(clonned_arr);
};

ImmutableCollection.prototype.unshift = function(obj){
	var clonned_arr = this.slice();
	clonned_arr.unshift(obj);

	return new this.constructor(clonned_arr);
};

ImmutableCollection.prototype.removeAt = function(index){
	if(!this.hasIndex(index)) return this;
	var clonned_arr= this.slice();
	clonned_arr.splice(index, 1);

	return new this.constructor(clonned_arr);
};


ImmutableCollection.prototype.peek = function(){
	return this.last();
};

ImmutableCollection.prototype.pop = function(){
	var clonned_arr= this.slice();
	clonned_arr.pop();

	return new this.constructor(clonned_arr);
};

ImmutableCollection.prototype.hasIndex= function(index)
{
	return (this[index] != undefined);
};

ImmutableCollection.prototype.get = function(index){
	return this[index];
};

ImmutableCollection.prototype.first = function(){
	return this.get(0);
};

ImmutableCollection.prototype.last = function(){
	return this.get(this.length-1);
};


ImmutableCollection.prototype.foreach= function(){
	var funcArgs = [];
	var func;

	if(arguments.length >= 1 && ((typeof arguments[arguments.length-1] == "function"))){
		funcArgs = [].slice.call(arguments);
		func= funcArgs.pop();
	}
	else return;

	funcArgs.unshift({itt: 0, length: this.length, coll: this, ritt: this.length-1});

	for(; funcArgs[0].itt< funcArgs[0].length; funcArgs[0].itt += 1){
		if (funcArgs.length ==1) func.apply(this.get(funcArgs[0].itt), [funcArgs[0]]);
		else func.apply(this.get(funcArgs[0].itt), funcArgs);
		funcArgs[0].ritt--;
	}
};

ImmutableCollection.prototype.concat= function(right){

	right= (right instanceof ImmutableCollection || right instanceof Array)? right.slice(): undefined;
	if(!right) return this;

	var clonned_arr= this.slice();
	return new this.constructor(clonned_arr.concat(right));
};

ImmutableCollection.prototype.empty= function(){
	return new this.constructor([]);
};

ImmutableCollection.prototype.toString= function(){
	return "["+this.join()+"]";
};


var DOMM = function(selector){   
    var _validateNodeType = function(node) {
		if (!node || !(node instanceof Node)) return false;

		return ((node.nodeType == Node.ELEMENT_NODE) || (node.nodeType == Node.DOCUMENT_NODE));
    };

    	var _select = function(selector, node){
		if(!selector || !(typeof selector == "string")) return new DOMMNodeCollection([]);

				var matchedNode = _validateNodeType(node);
		var root = (node && matchedNode) ? node : document;	
		var res = [];

				res = Sizzle(selector, root); 
		return new DOMMNodeCollection(res);
	};

	if (!selector) return new DOMMNodeCollection([]);

		if (arguments.length > 1) {
		var selector = arguments[0];
		var node = arguments[1];

		return _select(selector, node);
	};

 	if (selector instanceof DOMMNodeCollection) return selector;
	if (selector instanceof DOMMNode) return new DOMMNodeCollection([selector._node]);
	if (selector instanceof Node) return new DOMMNodeCollection([selector]);
	if (selector instanceof Object && selector.length != undefined) return new DOMMNodeCollection(selector); 
	if (!typeof selector == "string" || selector.length == 0) return new DOMMNodeCollection([]);

	var newNode = new DOMMNode(selector);
	var nodeColl = new DOMMNodeCollection([]);
	var resColl = (newNode._node) ? nodeColl.push(newNode._node) : nodeColl;

	if (resColl.length == 0) {
		var dummyParent = document.createElement("div");	
		dummyParent.innerHTML = (selector).trim();
		var docFragment = document.createDocumentFragment();

				while(dummyParent.childNodes.length > 0) {
			docFragment.appendChild(dummyParent.childNodes[0]);
		};


						var resColl = new DOMMNodeCollection([]);


				 for(var i = 0; i < docFragment.childNodes.length; i++) {
			 resColl = resColl.push(new DOMMNode(docFragment.childNodes[i]));
		 };
	};

		if (resColl.length > 0) return resColl;

	var queryRes = _select(selector);
	resColl = new DOMMNodeCollection(queryRes);

	return resColl;
};

var DOMQuery = DOMM;
var $$ = DOMM;
var _ = DOMM;



(function () {
	window.DOMMNode = function (element) {
		this._node = null; 
		if (!element) return;

				if (typeof element == "string"){
			var regex = /^\s*<\s*([a-zA-Z0-9_\-]+)\s*>\s*$/g;
			var pattern = new RegExp(regex);

			if (pattern.test(element)) {
				var elementType = element.replace(regex, "$1");
				this._node = document.createElement(elementType);
			}
		} else if (isProperNode(element)) {
			this._node = element;
		}
	};

	DOMMNode.prototype.remove = function (selector) {
		this.detach();

		if (selector){
			var queryResult = DOMM(selector, this._node);

			queryResult.foreach(function() {
				this.remove();
			});

				return this;
		}

		this.events()

		var nodeEventProp = this._g_DomDataPropertyName != undefined ? this._g_DomDataPropertyName : "domm_data";

		if (nodeEventProp != undefined && nodeEventProp.length > 0){
			if(this._node[nodeEventProp] != undefined && this._node[nodeEventProp].events != undefined) {
				for (var eventName in this._node[nodeEventProp].capture) {
					this._node.removeEventListener(eventName, ROmniEventHandlerCapture, true);
				}

				for (var eventName in this._node[nodeEventProp].bubble) {
					this._node.removeEventListener(eventName, ROmniEventHandlerBubble, false);
				}
			}
		}

			delete this._node[nodeEventProp];
		this.innerHtml(""); 
		this._node = null;
	};

	DOMMNode.prototype.detach = function () {
		var nodeParent = this.getParent();
		if (nodeParent && nodeParent._node) nodeParent._node.removeChild(this._node);

			return this;
	};


		DOMMNode.prototype.contains = function (element) {
		if (!this._node) return false;

			if (element instanceof DOMMNode) element = element._node;
		if (isProperNode(element)) return this._node.contains(element);

			return false;
	};

	DOMMNode.prototype.select = function (selector, nearest) {
		if (this._node && selector && typeof selector == "string") {
			var queryRes = DOMM(selector, this._node);

									if(nearest) {				
				var target__ = this._node;
				var min = 0;
				var nrst = [];

								var findMe = function(node_, target_, i) {
					if (!(isProperNode(node_) && isProperNode(target_))) return -1;
					if (node_ === target_){
						return i;
					} else {
						return findMe(node_.parentElement, target_, ++i);
					}
				}

				queryRes.foreach(function(ittobj) {
					var currLvl = findMe(this._node, target__, 0);
					if(ittobj.itt == 0) min = currLvl;

										if(currLvl === min){
						nrst.push(this)
					}

						if(currLvl < min){
						min = currLvl;
						nrst = [];
						nrst.push(this);
					}
				});

					return new DOMMNodeCollection(nrst);
			}

						return queryRes;
		}

			return new DOMMNodeCollection([]);
	};

		DOMMNode.prototype.selectNearest= function(selector) {
		return this.select(selector, true);
	};


		DOMMNode.prototype.toString = function () {
		return  this.outerHtml();
	};

		DOMMNode.prototype.outerHtml = function () {
		if (!this._node) return undefined;

			return this._node.outerHTML;
	};

		DOMMNode.prototype.innerHtml = function (htmlMarkup) {
		if (htmlMarkup != undefined) {
			if (!this._node) return this;
			if (typeof htmlMarkup != 'string') return this;

				this._node.innerHTML = htmlMarkup;

				return this;
		}

			if (!this._node) return undefined;

			return this._node.innerHTML;
	};

		DOMMNode.prototype.text = function(text, returnInnerText) {
		if (text == '' || (text && typeof text === 'string')) {
			if (!this._node) return this;

				this._node.textContent = text; 
			return this;
		}

				if (!this._node) return undefined;

		if(!returnInnerText || typeof returnInnerText != 'boolean') return this._node.textContent;
		return (returnInnerText == true) ? this._node.innerText : this._node.textContent;
	};



		var _attachChild = function (args, isAppend) {
		if (!this._node) return this;
		if (args.length == 0) return this;

			var children = DOMM((args.length === 1) ? args[0] : Array.prototype.slice.call(args));
		if (!children || children.length == 0) return this;

				if (isAppend == true){
			for(var i = 0; i < children.length; i++) {
				this._node.appendChild(children[i]);
			}
		}else if (isAppend == false){
			for(var i = children.length - 1; i >= 0; i--) {
				this._node.insertBefore(children[i], this._node.childNodes[0]);
			}
		}

			return this;
	};

	var _attachChildTo = function(arg, isAppend){
		if (!this._node) return this;
		if (!arg || typeof isAppend != 'boolean') return this;

			if (arg.length == 1) arg = arg[0];
		if (typeof arg === "string") arg = DOMM(arg);
		if (arg instanceof DOMMNodeCollection) return isAppend ? arg.push(this) : arg.unshift(this);
		if (arg instanceof DOMMNode && arg._node) arg = arg._node;

			if (!isProperNode(arg)) return this;

		if (isAppend == true){
			arg.appendChild(this._node);
		}else if (isAppend == false){
			arg.insertBefore(this._node, arg.firstChild);
		}

				return this;
	};

		var _attachWith = function(args, isAppend){
		if (!this._node) return this;
		if (!args || typeof isAppend != 'boolean') return this;

			var newColl = new DOMMNodeCollection([]);

			if (isAppend == true) newColl = newColl.push(this);

			for (var i = 0; i < args.length; i++) {
			var currNode = args[i];
			if (currNode instanceof DOMMNode) currNode = currNode._node;
			if (isProperNode(currNode)){
				newColl = newColl.push(currNode);
			};
		}

			if (isAppend == false) newColl = newColl.push(this);

				return newColl;
	};

		var _insertChild = function(inputElement, index, isAfter){
		if (!this._node) return this;
		if (!inputElement || typeof isAfter != 'boolean') return this;
		if (inputElement instanceof DOMMNode) inputElement = inputElement._node;
		if (!isProperNode(inputElement)) return this;
		if (!this._node.children) {
			this._node.append(inputElement);
			return;
		}

		if (index < 0 || index > this._node.children.length) return this;

				if (isAfter == true){
			var existingElement = (this._node.childNodes[index + 1]) ? this._node.childNodes[index + 1] : this._node.childNodes[this._node.children.length - 1].nextSibling
			this._node.insertBefore(inputElement, existingElement);
		}else if (isAfter == false){
			this._node.insertBefore(inputElement, this._node.childNodes[index]);
		}

			return this;
	};

	DOMMNode.prototype.getChildren = function () {
		return (!this._node) ? new DOMMNodeCollection([]) : new DOMMNodeCollection(this._node.children);
	};

		DOMMNode.prototype.append = function(){
		return _attachChild.call(this, arguments, true);
	};

		DOMMNode.prototype.prepend = function(){
		return _attachChild.call(this, arguments, false);
	};

	DOMMNode.prototype.appendTo = function () {
		return _attachChildTo.call(this, arguments, true);
	};

		DOMMNode.prototype.prependTo = function () {
		return _attachChildTo.call(this, arguments, false);
	};

	DOMMNode.prototype.appendWith = function(){
		return _attachWith.call(this, arguments, true);
	};

	DOMMNode.prototype.prependWith = function(){
		return _attachWith.call(this, arguments, false);
	};

		DOMMNode.prototype.insertChildBefore = function (index, inputElement) {
		return _insertChild.call(this, inputElement, index, false);
	};

		DOMMNode.prototype.insertChildAfter = function (index, inputElement) {
		return _insertChild.call(this, inputElement, index, true);
	};

	DOMMNode.prototype.removeChild = function (child) {
		if (!this._node) return this;

			if (child instanceof DOMMNode) child = child._node;
		if (isProperNode(child)) {
			this._node.removeChild(child);
		} else if(!isNaN(arguments[0]) && typeof arguments[0] == 'number'){
			var index = arguments[0]

				if(index >= 0 && index < this._node.children.length){
				this._node.removeChild(this._node.children[index]);
			}
		}

			return this;
	};


		DOMMNode.prototype.getPrev = function () {
		if (!this._node) return this;
		return new DOMMNode(this._node.previousElementSibling);
	};

		DOMMNode.prototype.getNext = function () {
		if (!this._node) return this;
		return new DOMMNode(this._node.nextElementSibling);
	};

		DOMMNode.prototype.getParent = function () {
		if (!this._node) return this;
		return new DOMMNode(this._node.parentElement);
	};

		DOMMNode.prototype.getAllParents = function () {
		var parentNode = this.getParent()._node;
		var parentsChain = [];

		while (parentNode) {
			if(parentNode.nodeName == "body" || parentNode == undefined) break;

			parentsChain.push(parentNode);
			parentNode = parentNode.parentElement;
		}

			return new DOMMNodeCollection(parentsChain);
	};

		DOMMNode.prototype.closestParent = function (selector) {
		if (!this._node) return this;
		if (typeof selector != "string") return this.getParent();

			var isMatched;
		var element = this.getParent();

			while (element) {
			isMatched = Sizzle.matchesSelector(element, selector);
			if(isMatched) return new DOMMNode(element);

			element = element.parentElement;
		}

			return new DOMMNode(element);
	};

	DOMMNode.prototype.properties = function (propName, propValue) {
		if (!this._node) return this;
		if (typeof propName != "string") return this;

		if (arguments.length == 2){ 
			this._node[propName] = propValue;

						return this;
		} else if (arguments.length == 1) {
			return this._node[propName];
		}
	};

		DOMMNode.prototype.hasProperty = function (propName) {
		return (!this._node) ? false : (!(!this._node[propName]));
	};

	var _getAttributeValue = function (attrName) { 
		if (!this._node) return undefined;
		if (!attrName || (typeof attrName != 'string')) return undefined; 	
		if (!this.hasAttributes(attrName)) return undefined;

				var attrValue = this._node.getAttribute(attrName.toLowerCase());
		return (attrValue != null) ? attrValue : undefined;
	};

		var _setAttribute = function (key, value) { 
		if (!this._node) return this;
		if (typeof key != "string") return this;

			if (key == 'style') {
			this.removeStyles();
			this.attributes("style", value.toString());
		} else {
			this._node.setAttribute(key.toLowerCase(), value);
		}

			return this;
	};

	DOMMNode.prototype.id = function (value){
		if (arguments.length ==  0) return this.attributes("id");
		if (typeof value != 'string') return this;

		if (value.length == 0) {
			this.removeAttributes("id");
			return this;
		}

		this.attributes("id", value);

		return this;
	};

	DOMMNode.prototype.attributes = function (arg) {
		switch(arguments.length){
			case 0:
				if(!this._node) return undefined;
				return this._node.attributes;




			case 1:
				if (typeof arg == 'string') {
					return _getAttributeValue.call(this, arg);
				} else if (typeof arg === 'object' && !Array.isArray(arg)) {
					var inputObject = arg;
					var inputObjectKeys = Object.getOwnPropertyNames(inputObject);

							for (var i = 0; i < inputObjectKeys.length; i += 1) {
						var currAttr = inputObjectKeys[i];

						_setAttribute.call(this, currAttr, inputObject[currAttr]);
					}

							return this;
				}
				break;
			case 2:
				var attrKey = arguments[0];
				var attrValue = arguments[1];

						return _setAttribute.call(this, attrKey, attrValue);
		}
	};

	DOMMNode.prototype.hasAttributes = function (attr) {
		if (typeof attr != "string" || attr.length == 0) return false;
		if (this._node.hasAttribute(attr.toLowerCase())) return true;

			return false;
	};

	DOMMNode.prototype.removeAttributes = function (attr) {
		if (!this._node) return this;
		if (typeof attr != "string") return this;

			if (attr == 'style') this._node.setAttribute('style', '');

			this._node.removeAttribute(attr.toLowerCase());

			return this;
    };

    DOMMNode.prototype.getComputedStyles = function (input) {
        if (arguments.length == 0) return getComputedStyle(this._node);
        if (!this._node) return this;

        if (arguments.length == 1) {


            if (typeof input == 'string') {
                if (input.length == 0 || !_isValidStyle.call(this, input)) return undefined;

                return getComputedStyle(this._node)[input];
            }
        }
    };



		var _manipClasses = function (argsArr, func) {
		if (!this._node) return this; 
		var args = argsArr[0];

			var argsIsArray = (typeof args === 'object' && Array.isArray(args)); 
		var classes = (argsIsArray) ? args : argsArr;

			if (argsArr.length == 1 && (typeof args == 'string') && !argsIsArray) {
			var classSplitRegex = /\s+/g;
			classes = args.split(classSplitRegex);
		}

			var existingClasses = (this._node.className.length != 0) ? this._node.className.split(' ') : [];

			for (var i = 0, classesLength = classes.length; i < classesLength; i += 1) {
			var currClass = classes[i];

				if ((typeof currClass != "string") || (currClass.trim().length == 0)) continue;

				var index = existingClasses.indexOf(currClass);

				func(currClass, index, existingClasses, classes);
		}

			if (existingClasses.length > 0) {
			this._node.className = existingClasses.sort().join(' ').trim();
		} else {
			this.removeAttributes("class");
		}

			return this;
	};


		DOMMNode.prototype.classes = function (){ 
		if(!this._node) return this;

				if (arguments.length == 0){
			var classSplitRegex = /\s+/g;
			return (this.hasAttributes('class')) ? _getAttributeValue.call(this, 'class').split(classSplitRegex).sort() : [];
		}else{
			return _manipClasses.call(this, arguments, function (currClass, index, existingClasses, classes) {
				if (index == -1) {
					existingClasses.push(currClass);
				}
			});
		}
	};

		DOMMNode.prototype.toggleClasses = function (args) {
		if(!this._node) return this;

			return _manipClasses.call(this, arguments, function (currClass, index, existingClasses, classes) {
			if (index != -1) {
				existingClasses.splice(index, 1);
			} else {
				existingClasses.push(currClass);
			}
		});
	};

		DOMMNode.prototype.removeClasses = function () {
		if(!this._node) return this;

			if (arguments.length == 0) {
			this.removeAttributes('class');
			return this;
		}

			return _manipClasses.call(this, arguments, function (currClass, index, existingClasses, classes) {
			if (index != -1) {
				existingClasses.splice(index, 1);
			}
		});
	};

	DOMMNode.prototype.hasClasses = function (args) {
		if (!this._node) return this;
		if (arguments.length == 0) {
			return this._node.className.length > 0 ? true : false;
		}

			var argsIsArray = (typeof args === 'object' && Array.isArray(args));
		var classes = (argsIsArray) ? args : arguments;

			if (arguments.length == 1 && (typeof args == "string") && !argsIsArray) {
			var classSplitRegex = /\s+/g;
			classes = args.split(classSplitRegex);
		}

			var existingClasses = (this._node.className.length != 0) ? this._node.className.split(' ') : [];

			for (var i = 0; i < classes.length; i += 1) {
			if (existingClasses.indexOf(classes[i]) == -1) return false;
		}

			return true;
	};



		var _isValidStyle = function (inputStyle) {
		return this._node.style[inputStyle.toString()] != undefined;
	};


		DOMMNode.prototype.styles = function (input) {
		if (!this._node) return this;

		if (arguments.length == 0) return this._node.style;
		if (arguments.length == 1) {
			if (typeof input === 'object' && !Array.isArray(input)) {
				var argkeys = Object.getOwnPropertyNames(input);

					for (var i = 0; i < argkeys.length; i += 1) {
					var styleKey = argkeys[i];
					if (_isValidStyle.call(this, styleKey.toString())) {
						this._node.style[styleKey] = input[styleKey].toString();
					}
				}
			} else if (typeof input == 'string') {
				if (input.length == 0 || !_isValidStyle.call(this, input)) return undefined;

					return this._node.style[input];
			} 
		} else if (arguments.length == 2) {
			var key = arguments[0];
			var value = arguments[1].toString();

				if (_isValidStyle.call(this, key) && value.length > 0) {
				this._node.style[key] = value;
			}
		}

			return this;
	};

	DOMMNode.prototype.removeStyles = function (args) {
		if (!this._node) return this; 
		if (arguments.length == 0) {
			this.removeAttributes('style');
		} else if (arguments.length >= 1) {
			if (!this.hasAttributes('style') || _getAttributeValue.call(this, 'style').trim().length == 0) return this;

				var arrCheck = (arguments.length == 1 && Array.isArray(args));
			var styles = (!arrCheck) ? arguments : args;

				for (var i = 0; i < styles.length; i++) {
				var style = styles[i];

					if (typeof style != "string" || !_isValidStyle.call(this, style)) continue; 

					this._node.style[style] = "";
			}
		}

			if(this._node.style.length === 0) this.removeAttributes('style');

			return this;
	};


		DOMMNode.prototype.isEqualTo = function (node) {
		node = (node instanceof DOMMNode) ? node._node : node;

			if(isProperNode(this._node) && this._node.isEqualNode(node)) return true;

				return false;
	};

		DOMMNode.prototype.isReferenceOf = function (node) {
		node = (node instanceof DOMMNode) ? node._node : node;
		node = (isProperNode(this._node)) ? node : null;

			if(this._node === node) return true;

				return false;
	};


	DOMMNode.prototype.clone = function (deep) {
		if (!this._node) return this;
		if (deep == undefined) deep = true;

				return new DOMMNode(this._node.cloneNode(deep));
	};

	DOMMNode.prototype.isDummy = function () {
		return !this._node;
	};

		DOMMNode.prototype.empty = function () {
		this.innerHtml('');
		return this;
	};

		DOMMNode.prototype.getNative = function () {
		return this._node;
	};


	DOMMNode.prototype.getAttributes = function (filt) {
		if (!this._node) return this;

		var a = {};

					var reFilt = (filt == null) ? null : new RegExp(filt, "i");
		var matches = null;
		var attrs = this.attributes();

		for(var i = 0; i < attrs.length; i++) {
			matches = null;
			if (reFilt == null) {
				a[i.name] = attrs[i].value;
			} else {
				matches = attrs[i].name.match(reFilt);
				if (matches != null && matches.length > 0) {
					if (matches[1] == null) {
						a[''] = attrs[i].value;
					} else {
						a[matches[1]] = attrs[i].value;
					}
				}
			}
		}

			return a;
	};

		DOMMNode.prototype.properties = function (args) {
		if(!this._node) return this;
		if (arguments.length == 0){
			return this._node;
		} else if (arguments.length == 1) {
			if (typeof args == 'string') {
				return this._node[args];

				} else if (typeof args === 'object' && !Array.isArray(args)) { 
				var argsKeys = Object.getOwnPropertyNames(args);

					for (var i = 0, argKeysLength = argsKeys.length; i < argKeysLength; i += 1) {
					var currProp = argsKeys[i];
					this._node[currProp] = args[currProp]
				}

					return this;
			}
		} else if (arguments.length == 2) { 
			var propKey = arguments[0];
			var propValue = arguments[1];

						this._node[propKey] = propValue;

				return this;
		}
	};

	var _removeProperty = function (prop) {
		if (!this._node || typeof prop != "string") return this;

			delete this._node[prop];

		if(this._node[prop] != undefined) this._node[prop] = '';

			return this;
	};

		DOMMNode.prototype.is = function(filter){
		return Sizzle.matchesSelector(this._node, filter);
	};

		DOMMNode.prototype.getElementIndex = function(){
		if (!this._node) return -1;

			var index = 0;
		var el = this._node;

			while (el = el.previousElementSibling) {
			index++; 
		}

				return index;
	};

	var isProperNode = function(node) {
		if(!node || !(node instanceof Node)) return false;

		var nodeType = node.nodeType;
		return ((nodeType == Node.ELEMENT_NODE) || (nodeType == Node.DOCUMENT_NODE));
	};


	DOMMNode.prototype.hide = function () {
		if(this._node){
			if(this._node.style.display && this._node.style.display != 'none'){
				this.properties('data-DOMM-display', this._node.style.display);
			} else{
				var compDisp = getComputedStyle(this._node).display;
				if(compDisp != 'none'){
					this.properties('data-DOMM-display', compDisp);
				}
			}

				this._node.style.display = 'none';
		}

			return this;
	};

		DOMMNode.prototype.show = function () {
		if(this._node){
			this._node.style.display = (this.properties('data-DOMM-display')) ? this.properties('data-DOMM-display') : 'block';

			if(this.properties('data-DOMM-display')){
				_removeProperty.call(this,'data-DOMM-display');
			}

		}

			return this;
	};
})();
	

(function () {

    DOMMNode.prototype.offset = function (pos) {
		if (!this._node) return this;
		var computedStyles = getComputedStyle(this._node);

			if(arguments.length == 0){

				return{
				top: this._node.offsetTop,
				left: this._node.offsetLeft,
				width: this._node.offsetWidth,
				height: this._node.offsetHeight,
				x: this._node.offsetLeft,
				y: this._node.offsetTop,
				bottom: this._node.offsetTop + this._node.offsetHeight,
				right: this._node.offsetLeft + this._node.offsetWidth
			}
		} else {
			var marginTop = +computedStyles.marginTop.slice(0, computedStyles.marginTop.length - 2)
			var marginLeft = +computedStyles.marginLeft.slice(0, computedStyles.marginLeft.length - 2);

				if(pos.y != undefined){
				this._node.style.top = pos.y - marginTop + 'px';
			}

						if(pos.x != undefined){
				this._node.style.left = pos.x - marginLeft + 'px';
			}

				var paddingLeft = +computedStyles.paddingLeft.slice(0, computedStyles.paddingLeft.length - 2);
			var paddingRight = +computedStyles.paddingRight.slice(0, computedStyles.paddingRight.length - 2);
			var paddingTop = +computedStyles.paddingTop.slice(0, computedStyles.paddingTop.length - 2);
			var paddingBottom = +computedStyles.paddingBottom.slice(0, computedStyles.paddingBottom.length - 2);
			var bordergLeft = +computedStyles.borderLeftWidth.slice(0, computedStyles.borderLeftWidth.length - 2);
			var bordergRight = +computedStyles.borderRightWidth.slice(0, computedStyles.borderRightWidth.length - 2);
			var bordergTop = +computedStyles.borderTopWidth.slice(0, computedStyles.borderTopWidth.length - 2);
			var bordergBottom = +computedStyles.borderBottomWidth.slice(0, computedStyles.borderBottomWidth.length - 2);

				if(computedStyles.boxSizing == 'border-box'){
				if(pos.w){
					this._node.style.width = pos.w + 'px';
				}

					if(pos.h){
					this._node.style.height = pos.h + 'px';
				}
			} else {
				if(pos.w){
					this._node.style.width = pos.w - bordergLeft - bordergRight - paddingLeft - paddingRight + 'px';
				}

								if(pos.h){
					this._node.style.height = pos.h - bordergTop - bordergBottom - paddingTop - paddingBottom + 'px';
				}
			}

		}
	};

		DOMMNode.prototype.client = function (pos) {
		if (!this._node) return this;

			if(arguments.length == 0){
			return{
				top: this._node.clientTop,
				left: this._node.clientLeft,
				width: this._node.clientWidth,
				height: this._node.clientHeight,
				x: this._node.clientTop,
				y: this._node.clientLeft,
				bottom: this._node.clientTop + this._node.clientHeight,
				right: this._node.clientLeft + this._node.clientWidth
			}
		} else {
			var computedStyles = getComputedStyle(this._node);
			var paddingLeft = +computedStyles.paddingLeft.slice(0, computedStyles.paddingLeft.length - 2);
			var paddingRight = +computedStyles.paddingRight.slice(0, computedStyles.paddingRight.length - 2);
			var paddingTop = +computedStyles.paddingTop.slice(0, computedStyles.paddingTop.length - 2);
			var paddingBottom = +computedStyles.paddingBottom.slice(0, computedStyles.paddingBottom.length - 2);
			var bordergLeft = +computedStyles.borderLeftWidth.slice(0, computedStyles.borderLeftWidth.length - 2);
			var bordergRight = +computedStyles.borderRightWidth.slice(0, computedStyles.borderRightWidth.length - 2);
			var bordergTop = +computedStyles.borderTopWidth.slice(0, computedStyles.borderTopWidth.length - 2);
			var bordergBottom = +computedStyles.borderBottomWidth.slice(0, computedStyles.borderBottomWidth.length - 2);

				if(computedStyles.boxSizing == 'border-box'){
				this._node.style.width = pos.width + (this._node.offsetWidth - this._node.clientWidth) + 'px';
				this._node.style.height = pos.height + (this._node.offsetHeight - this._node.clientHeight) + 'px';
			} else {
				this._node.style.width = pos.width - bordergLeft - bordergRight + (this._node.offsetWidth - this._node.clientWidth) - paddingLeft - paddingRight + 'px';
				this._node.style.height = pos.height - bordergTop - bordergBottom + (this._node.offsetHeight - this._node.clientHeight) - paddingTop - paddingBottom  + 'px';
			}

				console.log('w='+this._node.clientWidth);
			console.log('h='+this._node.clientHeight);
			console.log(computedStyles.boxSizing);
		}
	};

		DOMMNode.prototype.isVisible = function () {
		var el = this._node;

			while (el) {

				if(el.offsetWidth == 0 && el.offsetHeight == 0){
				return false;
			}

				el = el.parentElement;
		}

			return true;
	};

	DOMMNode.prototype.focus = function(){
		if (!this._node) return this;

		this._node.focus();

		return this;
	};

	DOMMNode.prototype.blur = function(){
		if (!this._node) return this;

		this._node.blur();

		return this;
	};

		DOMMNode.prototype.scrollTop = function(val){
		if (!this._node) return this;
		if (arguments.length == 0) return this._node.scrollTop;

					this._node.scrollTop = val;
	};

		DOMMNode.prototype.scrollLeft = function(val){
		if (!this._node) return this;
		if (arguments.length == 0) return this._node.scrollLeft;

			this._node.scrollLeft = val;
	};
})();
(function () {
window.DOMMNodeCollection = function (inputNodeCollection) {
	ImmutableCollection.call(this);
	var nodeCollection = inputNodeCollection;

	if (arguments.length > 1) nodeCollection = arguments;
	if (nodeCollection instanceof Object && nodeCollection.length){
		var index = 0;
		for (var itt = 0; itt < nodeCollection.length; itt++) {
			var element = nodeCollection[itt];

						if (element instanceof DOMMNode) element = element._node;
			if (element == undefined || !isProperNode(element)) continue;

			this[index] = element;
			index ++;
		}

		this.length = index;
	}
};

DOMMNodeCollection.inherits(ImmutableCollection);


DOMMNodeCollection.prototype.push = function (item) {
	if (!item) return this;
	if (!isProperNode(item) && !isProperDOMMNode(item)) return this;
	item = (item instanceof DOMMNode) ? item._node : item;

		return (ImmutableCollection.prototype.push.call(this, item));
};

DOMMNodeCollection.prototype.unshift = function (item) {
	if (!item) return this;
	if (!isProperNode(item) && !isProperDOMMNode(item)) return this;
	item = (item instanceof DOMMNode) ? item._node : item;

		return (ImmutableCollection.prototype.unshift.call(this, item));
};

DOMMNodeCollection.prototype.get = function (index) {
	return new DOMMNode(this[index]);
};



DOMMNodeCollection.prototype.classes = function (args) {
	if (arguments.length > 0) {
		this.foreach(arguments, function (ittobj, args_) {
			this.classes.apply(this, args_);
		});
	}

	return this;
};

DOMMNodeCollection.prototype.toggleClasses = function (args) {
	this.foreach(arguments, function (ittobj, args_) { 
		this.toggleClasses.apply(this, args_); 
	});
	return this;
};

DOMMNodeCollection.prototype.removeClasses = function (args) {
	this.foreach(arguments, function (ittobj, args_) { this.removeClasses.apply(this, args_); });
	return this;
};

DOMMNodeCollection.prototype.hasClasses = function (args) {
	var res = false;

	this.foreach(arguments, function (ittobj, args_) {
		res = this.hasClasses.apply(this, args_);
		if (res == false) return;
	});

	return res;
};



DOMMNodeCollection.prototype.styles = function (args) {
	if (arguments.length> 0){
		this.foreach(arguments, function (ittobj, args_) {
			this.styles.apply(this, args_);
		});	
	}        
};

DOMMNodeCollection.prototype.removeStyles = function (args) {
	this.foreach(arguments, function (ittobj, args_) {
		this.removeStyles.apply(this, args_);
	});

		return this;
};


DOMMNodeCollection.prototype.appendTo = function (target) {
	if (!target) return this;
	if (isProperNode(target)) target = new DOMMNode(target);
	if (target instanceof DOMMNodeCollection || isProperDOMMNode(target)){
		 this.foreach(function(){
			this.appendTo(target);
		});
	}

	return target;
};

DOMMNodeCollection.prototype.prependTo = function (target) {
	if (!target) return this;
	if (isProperNode(target)) target = new DOMMNode(target);
	if (target instanceof DOMMNodeCollection || isProperDOMMNode(target)){
		this.foreach(function(ittobj){
			ittobj.coll.get(ittobj.ritt).prependTo(target);
		});
	}

	return target;
};

DOMMNodeCollection.prototype.remove = function () {        
   this.foreach(function(){
	   this.remove();
   });

   return null;
};

DOMMNodeCollection.prototype.detach = function () {
	this.foreach(function(){
	   this.detach();
	});

	return this;
};

DOMMNodeCollection.prototype.insertAfter = function (target) {
	if (!target) return this;

	var currTarget = target;

	if (typeof currTarget === 'string') currTarget = DOMM(currTarget);
	if (currTarget instanceof DOMMNodeCollection) currTarget = currTarget.get(0);

		if (isProperNode(currTarget) || isProperDOMMNode(currTarget)){
		currTarget = (currTarget instanceof DOMMNode) ? currTarget : new DOMMNode(currTarget);
		var parent = currTarget.getParent();

		if(!parent) return this;
		var index;

		for (var i = 0; i < parent._node.children.length; i++) {
			if(currTarget.isEqualTo(parent._node.children[i])
			&& currTarget.isReferenceOf(parent._node.children[i])){
				index = i;
				break;
			}
		}

		if(index == undefined) return this;

		this.foreach(function(){
			parent.insertChildAfter(index, this);
			index++;
		})
	}

	return this;
};

DOMMNodeCollection.prototype.insertBefore = function (target) {
	if (!target) return this;
	var currTarget = target;

	if (typeof currTarget === 'string') currTarget = DOMM(currTarget);
	if (currTarget instanceof DOMMNodeCollection) currTarget = currTarget.get(0);

		if (isProperNode(currTarget) || isProperDOMMNode(currTarget)){

		currTarget = (currTarget instanceof DOMMNode) ? currTarget : new DOMMNode(currTarget);
		var parent = currTarget.getParent();

		if (!parent) return this;
		var index;

		for (var i = 0; i < parent._node.children.length; i++) {
			if (currTarget.isEqualTo(parent._node.children[i])
			&& currTarget.isReferenceOf(parent._node.children[i])){
				index = i;
				break;
			}
		}

		this.foreach(function(ittobj){
			parent.insertChildBefore(index, ittobj.coll[ittobj.ritt]);
		})
	}

	return this;
};

DOMMNodeCollection.prototype.clone = function (deep) {
	var resultArr = [];
	this.foreach(function(){
		resultArr.push(this.clone(deep));
	});      

	return new DOMMNodeCollection(resultArr);
};



DOMMNodeCollection.prototype.filter = function (selector) {
	var res = [];
	if (typeof selector === "string") {
		res = Sizzle.matches(selector, this);            
	} else if (typeof selector == "function") {
		this.foreach(function () { if (selector(this)) res.push(this); });
	}

	return new DOMMNodeCollection(res);
};

DOMMNodeCollection.prototype.outerHtml = function () {
	var res = "";
	this.foreach(function () {
		res += this.outerHtml();
	});

	return res;
};

DOMMNodeCollection.prototype.toString = function(){
	var res = "";

	this.foreach(function(ittobj){
		if (ittobj.itt > 0) res += ", ";
		res += this.toString();
	})

	return "[" + res + "]";
};

DOMMNodeCollection.prototype.toArray = function(){
	var res = [];

	for (var i = 0; i < this.length; i++) {
		res.push(this[i]);
	}

	return res;
};

DOMMNodeCollection.prototype.isEmpty = function(){
	return this.length == 0;
}

DOMMNodeCollection.prototype.has = function (selector) {
	var res = [];
	if (typeof selector === "object") {
		for (let i = 0, len = this.length; i < len; i++) {
			var el = this[i];

			if (selector instanceof DOMMNode) selector = selector._node;
			if (el.contains(selector)) res.push(el);	
		}
	} else if (typeof selector == "string") {
		for (let i = 0, len = this.length; i < len; i++) {
			var el = this[i];

			if (el.select(selector).length > 0) res.push(el);	
		}
	}

	return new DOMMNodeCollection(res);
};

var isProperNode = function(node) {
	if (!node || !(node instanceof Node)) return false;

	var nodeType = node.nodeType;
	return ((nodeType == Node.ELEMENT_NODE) || (nodeType == Node.DOCUMENT_NODE));
};

var isProperDOMMNode = function(node){
	if (!node) return false;

	return node instanceof DOMMNode && node._node != undefined;
};
})();
