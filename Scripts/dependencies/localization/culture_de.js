Globalize.addCultureInfo("de", "default", {
        name: "de",
        englishName: "German",
        nativeName: "Deutsch",
        language: "de",
        numberFormat: {
            ",": ".",
            ".": ",",
            NaN: "n. def.",
            negativeInfinity: "-unendlich",
            positiveInfinity: "+unendlich",
            percent: {
                pattern: ["-n%", "n%"],
                ",": ".",
                ".": ","
            },
            currency: {
                pattern: ["-n $", "n $"],
                ",": ".",
                ".": ",",
                symbol: "�"
            }
        },
        calendars: {
            standard: {
                "/": ".",
                firstDay: 1,
                days: {
                    names: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
                    namesAbbr: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
                    namesShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
                },
                months: {
                    names: ["Januar", "Februar", "M�rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember", ""],
                    namesAbbr: ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez", ""]
                },
                AM: null,
                PM: null,
                eras: [{ "name": "n. Chr.", "start": null, "offset": 0}],
                patterns: {
                    d: "dd.MM.yyyy",
                    D: "dd MMMM yyyy",
                    t: "HH:mm",
                    T: "HH:mm:ss",
                    f: "dd MMMM yyyy HH:mm",
                    F: "dd MMMM yyyy HH:mm:ss",
                    M: "dd MMMM",
					n: "dd.MM.yyyy HH:mm",
					//  long date-time numbers only
					N: "dd.MM.yyyy HH:mm:ss",
                    Y: "MMMM yyyy",
                    S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss",
                    K: "M/d",
					// f + weekday
					w: "dddd, dd MMMM yyyy HH:mm",
					// F + weekday
					W: "dddd, dd MMMM yyyy HH:mm:ss"
					
                }
            }
        }
    });