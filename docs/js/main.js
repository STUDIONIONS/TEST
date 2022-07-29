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
	weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function openModal(date, el) {
	const vr = clicked == date ? true : false;
	const arr = date.split('/'),
		num = arr.join(''),
		dt = arr.join('-'),
		eventForDay = events['d-' + num];
	clicked = date;
	let str = String(arr[1]).padStart(2, "0") + "." + String(arr[0]).padStart(2, "0") + "." + String(arr[2]).padStart(4, "0"),
		val = String(arr[2]).padStart(4, "0") + "-" + String(arr[0]).padStart(2, "0") + "-" + String(arr[1]).padStart(2, "0");
	if (eventForDay!=null) {
		if(el.id){
			let id = el.id.split('-')[2],
				data = eventForDay[id];
			document.getElementById('eventText').innerText = data.title;
			document.getElementById('eventWorker').innerText = data.body;
			titleDate1.innerText = str;
			deleteEventModal.setAttribute('data-edit', id);
			deleteEventModal.setAttribute('data-date', num);
			deleteEventModal.style.display = 'block';
		}else{
			newEventModal.style.display = 'block';
			titleDate0.innerText = str;
			eventTitleDate.style.display = vr ? 'block' : 'none';
			titleDate0.style.display = vr ? 'none' : 'block';
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
	backDrop.style.display = 'flex';
}

function load() {
	const dt = new Date();
	dt.setDate(1);
	dt.setMonth(dt.getMonth() + nav);
	const day = new Date().getDate(),
		month = dt.getMonth(),
		year = dt.getFullYear();

	const firstDayOfMonth = new Date(year, month, 0);
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	
	const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
		weekday: 'long',
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
	});
	const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

	document.getElementById('monthDisplay').innerText = 
		`${dt.toLocaleDateString('ru-ru', { month: 'long' })} ${year}`;

	calendar.innerHTML = '';

	for(let i = 1; i <= paddingDays + daysInMonth; i++) {
		const daySquare = document.createElement('div');
		daySquare.classList.add('day');

		const dayString = `${month + 1}/${i - paddingDays}/${year}`,
			cl = 'd-' + dayString.split('/').join('');

		if (i > paddingDays) {
			//daySquare.innerText = i - paddingDays;
			daySquare.setAttribute('data-curday', i - paddingDays);
			const eventForDay = Array.isArray(events[cl]) ? events[cl] : null;
			if (i - paddingDays === day && nav === 0) {
				daySquare.id = 'currentDay';
			}

			if (eventForDay) {
				if(Array.isArray(eventForDay)) {
					daySquare.classList.add('events');
					eventForDay.forEach(function(a, b, c) {
						let eventDiv = document.createElement('div');
						let eventDivWorker = document.createElement('div');
						let div = document.createElement('div');
						daySquare.appendChild(div);
						eventDiv.classList.add('event');
						eventDivWorker.classList.add('event');
						eventDiv.innerText = a.title;
						eventDivWorker.innerText = a.body;
						div.appendChild(eventDiv);
						div.appendChild(eventDivWorker);
						div.classList.add('event_work');
						div.title = `Ф.И.О: ${eventDivWorker.innerText}\nОписание: ${eventDiv.innerText}`;
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
		if(!Array.isArray(events[cl])) {
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
	if(!events[key].length){
		delete events[key];
	}
	localStorage.setItem('events', JSON.stringify(events));
	load();
	closeModal();
}

function keyEnter(e){
	if(e.keyCode == 13){
		e.preventDefault();
		saveEvent();
		return !1;
	}
}

function initButtons() {
	document.getElementById('nextButton').addEventListener('click', () => {
		++nav;
		console.log('next', nav);
		load();
	});

	document.getElementById('prevButton').addEventListener('click', () => {
		--nav;
		console.log('prev', nav);
		load();
	});
	today.forEach(function(a){
		a.addEventListener('click', function(e) {
			if(a.id != "update") {
				nav = 0;
			}
			load();
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
	load();
}

initButtons();
