/**
 * Calendar Events
**/
//(function(){
	let nav = 0,
		clicked = null,
		events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : {};

	const calendar = document.getElementById('calendar'),
		addEvent = document.getElementById('add'),
		newEventModal = document.getElementById('newEventModal'),
		deleteEventModal = document.getElementById('deleteEventModal'),
		backDrop = document.getElementById('modalBackDrop'),
		titleDate0 = document.getElementById('titleDate0'),
		titleDate1 = document.getElementById('titleDate1'),
		eventTitleDate = document.getElementById('eventTitleDate'),
		eventTitleInput = document.getElementById('eventTitleInput'),
		eventTitleWorker = document.getElementById('eventTitleWorker'),
		today = document.querySelectorAll('.today'),
		findText = document.getElementById('text-to-find'),
		weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	function openModal(date, el) {
		const vr = clicked == date ? true : false;
		const arr = date.split('/'),
			num = arr.join(''),
			dt = arr.join('-'),
			eventForDay = events['d-' + num],
			options = {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			},
			dateDate = new Date(arr[2], arr[0] - 1, arr[1]);
		clicked = date;
		let str = dateDate.toLocaleDateString(navigator.language, options),
			val = String(arr[2]).padStart(4, "0") + "-" + String(arr[0]).padStart(2, "0") + "-" + String(arr[1]).padStart(2, "0");
		if (eventForDay!=null && el) {
			if (el.id) {
				let id = el.id.split('-')[2],
					data = eventForDay[id];
				if (data) {
					document.getElementById('eventText').innerText = data.title;
					document.getElementById('eventWorker').innerText = data.body;
					titleDate1.innerText = str;
					deleteEventModal.setAttribute('data-edit', id);
					deleteEventModal.setAttribute('data-date', num);
					deleteEventModal.style.display = 'block';
				} else {
					newEventModal.style.display = 'block';
					titleDate0.innerText = str;
					eventTitleDate.style.display = vr ? 'none' : 'block';
					titleDate0.style.display = vr ? 'block' : 'none';
					setTimeout(function(){
						eventTitleInput.focus();
						eventTitleDate.value = val;
					}, 0);
				}
			} else {
				newEventModal.style.display = 'block';
				titleDate0.innerText = str;
				eventTitleDate.style.display = vr ? 'none' : 'block';
				titleDate0.style.display = vr ? 'block' : 'none';
				setTimeout(function(){
					eventTitleInput.focus();
					eventTitleDate.value = val;
				}, 0);
			}
		} else {
			newEventModal.style.display = 'block';
			titleDate0.innerText = str;
			eventTitleDate.style.display = vr ? 'none' : 'block';
			titleDate0.style.display = vr ? 'block' : 'none';
			setTimeout(function() {
				eventTitleInput.focus();
				eventTitleDate.value = val;
			}, 0);
		}
		backDrop.style.display = 'flex';
	}

	function load(updt) {
		const dt = new Date();
		dt.setDate(1);
		dt.setMonth(dt.getMonth() + nav);
		const day = new Date().getDate(),
			month = dt.getMonth(),
			year = dt.getFullYear();

		const firstDayOfMonth = new Date(year, month, 0);
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		
		const dateString = firstDayOfMonth.toLocaleDateString("en-US", {
			weekday: 'long',
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
		});

		const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

		document.getElementById('monthDisplay').innerText = 
			`${dt.toLocaleDateString(navigator.language, { month: 'long' })} ${year}`;

		calendar.innerHTML = '';
		function calendarFn() {
			let m = 0;
			for (let i = 1; i <= paddingDays + daysInMonth; i++) {
				let daySquare = document.createElement('div');
				daySquare.classList.add('day');

				let dayString = `${month + 1}/${i - paddingDays}/${year}`,
					cl = 'd-' + dayString.split('/').join(''),
					outDate = String(i - paddingDays).padStart(2, "0") + "." +
								String(month + 1).padStart(2, "0") + "." +
								String(year);

				if (i > paddingDays) {
					daySquare.setAttribute('data-curday', i - paddingDays);
					var eventForDay = Array.isArray(events[cl]) ? events[cl] : null;
					if (i - paddingDays === day && nav === 0) {
						daySquare.classList.add('current_day');
					}

					if (eventForDay) {
						if (Array.isArray(eventForDay)) {
							daySquare.classList.add('events');
							daySquare.id = cl;
							eventForDay.forEach(function(a, b, c) {
								let eventDiv = document.createElement('div'),
									eventDivWorker = document.createElement('div'),
									div = document.createElement('div'),
									options = {
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									};
								daySquare.appendChild(div);
								eventDiv.classList.add('event');
								eventDivWorker.classList.add('event');
								eventDiv.innerText = a.title;
								eventDivWorker.innerText = a.body;
								div.appendChild(eventDiv);
								div.appendChild(eventDivWorker);
								div.classList.add('event_work');
								div.title = `Дата:\n\t${outDate}\nФ.И.О:\n\t${eventDivWorker.innerText}\nОписание:\n\t${eventDiv.innerText}`;
								div.id = cl + "-" + b
							});
							
						}
					}
					daySquare.addEventListener('click', (e) => {
						e.preventDefault();
						clicked = dayString;
						openModal(dayString, e.target);
						return !1;
					});
				} else {
					daySquare.classList.add('padding');
				}

				calendar.appendChild(daySquare);    
			}
			m = (paddingDays + daysInMonth) % 7;
			if (m) {
				m = 7 - m;
				for (let p = 1; p <= m; ++p) {
					let daySquare = document.createElement('div');
					daySquare.classList.add('day');
					daySquare.classList.add('padding');
					calendar.appendChild(daySquare); 
				}
			}
			let event = new Event("keyup");
  			findText.dispatchEvent(event);
		}
		updt ? setTimeout(calendarFn, 10) : calendarFn();
	}


	function closeModal() {
		eventTitleInput.classList.remove('error');
		eventTitleWorker.classList.remove('error');
		newEventModal.style.display = 'none';
		deleteEventModal.style.display = 'none';
		backDrop.style.display = 'none';
		eventTitleInput.value = '';
		eventTitleWorker.value = '';
		clicked = null;
		deleteEventModal.removeAttribute('data-edit');
		deleteEventModal.removeAttribute('data-date');
	}

	function saveEvent() {
		let title = eventTitleInput.value.trim(),
			body = eventTitleWorker.value.trim();
		if (title && body) {
			eventTitleInput.classList.remove('error');
			eventTitleWorker.classList.remove('error');
			let cl = 'd-' + clicked.split('/').join(''),
				i;
			if (!Array.isArray(events[cl])) {
				events[cl] = [];
			}
			i = events[cl].length;
			events[cl].push({
				date: clicked,
				title: title,
				body: body,
			});
			localStorage.setItem('events', JSON.stringify(Object.assign({}, events)));
			load();
			closeModal();
		} else {
			eventTitleInput.classList.add('error');
			eventTitleWorker.classList.add('error');
		}
	}

	function deleteEvent() {
		let del = deleteEventModal.getAttribute('data-edit'),
			date = deleteEventModal.getAttribute('data-date'),
			key = 'd-' + date;
		events[key].splice(del, 1);
		if (!events[key].length) {
			delete events[key];
		}
		localStorage.setItem('events', JSON.stringify(events));
		load();
		closeModal();
	}

	function keyEnter(e){
		if (e.keyCode == 13) {
			e.preventDefault();
			saveEvent();
			return !1;
		}
	}

	function initButtons() {
		document.getElementById('nextButton').addEventListener('click', () => {
			++nav;
			load(true);
		});

		document.getElementById('prevButton').addEventListener('click', () => {
			--nav;
			load(true);
		});
		today.forEach(function(a){
			a.addEventListener('click', function(e) {
				if (a.id != "update") {
					nav = 0;
				}
				load(true);
			});
		});
		document.getElementById('saveButton').addEventListener('click', saveEvent);
		document.getElementById('cancelButton').addEventListener('click', closeModal);
		document.getElementById('deleteButton').addEventListener('click', deleteEvent);
		document.getElementById('closeButton').addEventListener('click', closeModal);
		eventTitleInput.addEventListener('keydown', keyEnter);
		eventTitleWorker.addEventListener('keydown', keyEnter);
		addEvent.addEventListener('click', (e) => {
			e.preventDefault();
			let date = new Date(),
				d = date.getDate(),
				m = date.getMonth(),
				y = date.getFullYear(),
				s = `${m + 1}/${d}/${y}`;
			clicked = null;
			openModal(s);
			return !1;
		});
		findText.addEventListener('keyup', function(e){
			e.preventDefault();
			search(this.value);
			return !1;
		})
		load();
	}

	initButtons();

//})();
