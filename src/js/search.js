const search = function (text = "") {
	const val = text.normalize().replace(/((?:\\)|(?:\|)|(?:\[)|(?:\])|(?:\.)|(?:\+)|(?:\*)|(?:\?)|(?:\:)|(?:\!)|(?:\^)|(?:\()|(?:\))|(?:\{)|(?:\})|(?:\$))/gi, `\\$1`),
		reg = new RegExp(val, 'i');
	let els;
	if(els = document.querySelectorAll('.day .event_work')) {
		els.forEach(function(a, b, c) {
			console.log(a);
			a.classList.remove('red');
		});
	}
	if(val.length >2) {
		for(var key in events){
			let arr = events[key];
			arr.forEach(function(a, b, c){
				let m, el;
				if ((m = reg.exec(a.title) !== null) || (m = reg.exec(a.body) !== null)) {
					let id = key + '-' + b;
					if(el = document.getElementById(id)) {
						el.classList.add('red');
					}
				}
			});
		}
	}
}