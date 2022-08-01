const search = function (text = "") {
	let tmp = document.querySelectorAll(".search_list"),
		topInp = document.getElementById('search'),
		findText = document.getElementById('text-to-find');
	Array.prototype.forEach.call(tmp, function(el) {
		el.parentNode.removeChild(el);
	});
	const val = String(text).trim().normalize().replace(/((?:\\)|(?:\|)|(?:\[)|(?:\])|(?:\.)|(?:\+)|(?:\*)|(?:\?)|(?:\:)|(?:\!)|(?:\^)|(?:\()|(?:\))|(?:\{)|(?:\})|(?:\$))/gi, `\\$1`),
		reg = new RegExp(val, 'i');
	let els;
	if(els = document.querySelectorAll('.day .event_work')) {
		els.forEach(function(a, b, c) {
			a.classList.remove('red');
		});
	}
	if(val.length > 0) {
		let ul = document.createElement('ul');
		ul.classList.add('search_list');
		topInp && topInp.append(ul);
		for(var key in events){
			let arr = events[key];
			arr.forEach(function(a, b, c){
				let m, t, el;
				if ((m = reg.exec(a.title) !== null) || (t = reg.exec(a.body) !== null)) {
					let id = key + '-' + b,
						strDate,
						li = document.createElement('li'),
						st = document.createElement('span'),
						sb = document.createElement('strong');
					li.setAttribute('data-date-item', id);
					st.innerText = a.title;
					sb.innerText = a.body;
					li.append(sb);
					li.append(st);
					ul.append(li);
					document.activeElement === findText && ul.classList.add('show');
					li.addEventListener('click', function(e){
						e.preventDefault();
						ul.classList.add('show');
						const inp = this.getAttribute('data-date-item'),
							arr = inp.split('-'),
							str = arr[1],
							regex = /(\d{2})(\d{2})(\d{4})/,
							subst = `$1/$2/$3`,
							result = str.replace(regex, subst),
							strTime = str.split('-')[1];
						openModal(result, b);
						return !1;
					});
					if(el = document.getElementById(id)) {
						el.classList.add('red');
					}
				}
			});
		}
	}
}