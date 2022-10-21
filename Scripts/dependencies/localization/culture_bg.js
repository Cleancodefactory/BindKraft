Globalize.addCultureInfo("bg", "default", {
        name: "bg",
        englishName: "Bulgarian",
        nativeName: "Български",
        language: "bg",
        numberFormat: {
            ",": " ",
            ".": ",",
            negativeInfinity: "- Безкрайност",
            positiveInfinity: "+ Безкрайност",
            percent: {
                ",": " ",
                ".": ","
            },
            currency: {
                pattern: ["-n $", "n $"],
                ",": " ",
                ".": ",",
                symbol: "лв."
            }
        },
        calendars: {
            standard: {
                "/": ".",
                firstDay: 1,
                days: {
                    names: ["Неделя", "Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота"],
                    namesAbbr: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
                    namesShort: ["Н", "П", "В", "С", "Ч", "П", "С"]
                },
                months: {
                    names: ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември", ""],
                    namesAbbr: ["Яну", "Феб", "Мар", "Апр", "Май", "Юни", "Юли", "Авг", "Сеп", "Окт", "Ное", "Дек", ""]
                },
                AM: null,
                PM: null,
                eras: [{ "name": "Съвремена", "start": null, "offset": 0}],
                patterns: {
                    d: "dd.MM.yyyy 'г.'",
                    D: "dd MMMM yyyy 'г.'",
                    t: "HH:mm",
                    T: "HH:mm:ss",
                    f: "dd MMMM yyyy 'г.' HH:mm",
                    F: "dd MMMM yyyy 'г.' HH:mm:ss",
                    M: "dd MMMM",
					n: "dd.MM.yyyy HH:mm",
					//  long date-time numbers only
					N: "dd.MM.yyyy HH:mm:ss",
                    Y: "MMMM yyyy 'г.'",
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