import { myFetch, capitalizeFirstLetter, dayMonth2dk } from "../helpers.js"

// Henter root element fra Html DOM
const root = document.querySelector("#activity-wrapper")

/**
 * Funktion til at liste aktiviteter med
 */
export const ActivityList = async () => {
  // Henter config settings
  const config = await myFetch("./config.json")

  // Dags dato
  let curdate = new Date()
  // Dags dato som unix timestamps
  let curstamp = Math.round(curdate.getTime() / 1000)
  // Næste dags midnat som unix timestamp
  let nextdaystamp = Math.round(curdate.setHours(0, 0, 0, 0) / 1000) + 86400

  // Henter data
  const url = "https://iws.itcn.dk/techcollege/schedules?departmentCode=smed"
  const result = await myFetch(url)
  let data = result.value

  // Filtrerer data for uønskede uddannelser via array fra config
  data = data.filter((elm) =>
    config.array_valid_educations.includes(elm.Education)
  )

  // Henter læsevenlige fag og uddannelser fra API
  const friendly_names = await myFetch(
    "https://api.mediehuset.net/infoboard/subjects"
  )
  const arr_friendly_names = friendly_names.result

  // Mapper data igennem
  data.map((item) => {
    // Justerer tidszone til Danmark
    item.StartDate = item.StartDate.replace("+01:00", "+00:00")
    // Sætter tidsformat til time:minut på property item.Time
    item.Time = new Date(item.StartDate).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })

    // Udskifter kryptiske navne og forkortelser til læsevenlige udgaver
    arr_friendly_names.map((word) => {
      if (word.name.toUpperCase() === item.Education.toUpperCase()) {
        item.Education = word.friendly_name
      }
      if (word.name.toUpperCase() === item.Subject.toUpperCase()) {
        item.Subject = word.friendly_name
      }
    })

    // Tilføjer property Stamp med timestamp (tid i sekunder)
    item.Stamp = Math.round(new Date(item.StartDate).getTime() / 1000)
  })

  // Sorterer array efter starttid og uddannelse
  data.sort((a, b) => {
    if (a.StartDate === b.StartDate) {
      return a.Education < b.Education ? -1 : 1
    } else {
      return a.StartDate < b.StartDate ? -1 : 1
    }
  })

  // Variabel til akkummuleret html
  let acc_html = `
			<table>
				<tr>
					<th>Kl.</th>
					<th>Uddannelse</th>
					<th>Hold</th>
					<th>Fag</th>
					<th>Lokale</th>
				</tr>`

  // Sætter array til dags dato aktiviteter
  let activities = []

  // Henter aktiviteter ind hvis tid plus en time er større end aktuel tid og mindre end midnat
  activities.push(
    ...data.filter(
      (elm) => elm.Stamp + 3600 >= curstamp && elm.Stamp < nextdaystamp
    )
  )

  // Sætter array til næste dags aktiviteter
  let nextday_activities = []
  // Henter næste dags aktiviter hvis stamp er større end / lig midnat
  nextday_activities.push(...data.filter((elm) => elm.Stamp >= nextdaystamp))

  // Hvis der er nogle næste dags aktiviteter
  if (nextday_activities) {
	// Laver læsevenlig dato format (Eks: Mandag d. 16. maj)
    const nextday_friendly = dayMonth2dk(nextday_activities[0].StartDate)
	// Tilføjer array index med læsevenlig dato til activities
    activities.push({ Day: nextday_friendly })
	// Tilføjer næste dags aktiviteter til activities
    activities.push(...nextday_activities)
  }

  // Begrænser antallet af aktiviteter med tal fra config - henter alle hvis 0
  if (config.max_num_activities) {
    activities = activities.slice(0, config.max_num_activities)
  }

  // Mapper activities med table row functions - diffentierer mellem row til dato eller aktiviteter
  activities.map((item) => {
    acc_html += item.Day ? createDayRow(item) : createRow(item)
  })

  // Afslutter html table
  acc_html += `</table>`
  // Udskriver som innerHTML i root element
  root.innerHTML = acc_html
}

/**
 * Generer row data til aktivitet
 * @param {Object} item - Objekt med aktivitetsdata
 * @returns HTML streng
 */
function createRow(item) {
  return `
		<tr>
		<td>${item.Time}</td>
		<td>${item.Education}</td>
		<td>${item.Team}</td>
		<td>${item.Subject}</td>
		<td>${item.Room}</td>
	   </tr>`
}

/**
 * Generer row data til dato
 * @param {Object} item
 * @returns HTML string
 */
function createDayRow(item) {
  return `
		<tr>
		<td colspan="5">${item.Day}</td>
	   </tr>`
}
