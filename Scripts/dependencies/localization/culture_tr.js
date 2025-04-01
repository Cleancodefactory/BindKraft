Globalize.addCultureInfo("tr", "default", {
        name: "tr",
        englishName: "Turkie",
        nativeName: "Türkiye",
        language: "tr",
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
                pattern: ["-n ₺", "n ₺"],
                ",": ".",
                ".": ",",
                symbol: "₺"
            }
        },
        calendars: {
            standard: {
                dateOrder: ["M","d", "y"],
                timeOrder: ["h", "m", "s"],
                "/": ".",
                firstDay: 1,
                days: {
                    names: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
                    namesAbbr: ["Pa", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"],
                    namesShort: ["Pa", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"]
                },
                months: {
                    names: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",""],
                    namesAbbr: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",""]
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