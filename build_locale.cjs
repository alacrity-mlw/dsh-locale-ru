// Build ./lib/client.js for dsh-locale-ru from ./translations/ru.json.
//
// The output matches the format the web bundle loader expects:
//   window.__ModuleLoader__.load({ id, factory: (require) => ... })
// Every namespace registers as its own owned effect so a partial pack still
// loads, and `common` covers shell-level copy.
const fs = require('fs');
const path = require('path');

const PKG = __dirname;
const dict = JSON.parse(fs.readFileSync(path.join(PKG, 'translations', 'ru.json'), 'utf8'));
const pkgName = JSON.parse(fs.readFileSync(path.join(PKG, 'package.json'), 'utf8')).name;

const namespaces = Object.keys(dict).sort();
let keys = 0;
for (const ns of namespaces) keys += Object.keys(dict[ns]).length;

const body = `window.__ModuleLoader__.load({
	id: ${JSON.stringify(pkgName)},
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		const LANGUAGE = { id: "ru", label: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439", fallback: "en" };
		const DICTIONARIES = ${JSON.stringify(dict, null, '\t').replace(/\n/g, '\n\t\t')};

		const inject = ["locale"];

		function apply(ctx) {
			ctx.effect(() => ctx.locale.addLanguage(LANGUAGE), "dsh-locale-ru: language");
			for (const ns of Object.keys(DICTIONARIES)) {
				ctx.effect(() => ctx.locale.register(ns, LANGUAGE.id, DICTIONARIES[ns]), "dsh-locale-ru: " + ns + " dictionary");
			}
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
`;

const out = path.join(PKG, 'lib', 'client.js');
fs.writeFileSync(out, body);
console.log(`wrote ${out}: ${namespaces.length} namespaces, ${keys} keys, ${body.length} bytes`);
