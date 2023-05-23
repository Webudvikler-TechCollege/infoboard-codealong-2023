import { myFetch } from "../helpers.js"

const root = document.querySelector('#busplan-wrapper')

export const BusPlan = async () => {
	const url = "https://xmlopen.rejseplanen.dk/bin/rest.exe/multiDepartureBoard?id1=851400602&id2=851973402&rttime&format=json&useBus=1"
	const response = await myFetch(url)

	if(response.MultiDepartureBoard.Departure.length) {
		const data = response.MultiDepartureBoard.Departure.splice(0,5)

		data.map((value, key) => {
			//console.log(value);
			const ul = document.createElement('ul')
			const li_line = document.createElement('li')
			const li_dir = document.createElement('li')
			const li_time = document.createElement('li')

			li_line.innerText = value.line
			li_dir.innerText = value.direction
			li_time.innerText = calcRemaingTime(`${value.date} ${value.time}`)


			ul.append(li_line, li_dir, li_time)
			root.append(ul)

		})

	}
}

function calcRemaingTime(departure_datetime) {
	console.log(departure_datetime);

	// Hent nutid i sekunder
	const curStamp = new Date().getTime()

	// Splitter dato streng op i et array dd-mm-yy-hh-mm
	const depParts = departure_datetime.split(/[.: ]/)
	//console.log(depParts);

	const depYear = new Date().getFullYear()
	const depMonth = parseInt(depParts[1],10)-1
	const depDay = parseInt(depParts[0],10)
	const depHours = parseInt(depParts[3],10)
	const depMinutes = parseInt(depParts[4],10)

	const depStamp = new Date(
		depYear,
		depMonth,
		depDay,
		depHours,
		depMinutes
	).getTime()

	// Beregner forskel i sekunder fra nutid
	const diff_seconds = Math.abs(Math.floor((depStamp - curStamp) / 1000))
	const hours = Math.floor(diff_seconds / 3600)
	const minutes = Math.floor(diff_seconds / 60)
	return hours ? `${hours}t ${minutes}m` : `${minutes}m`
}