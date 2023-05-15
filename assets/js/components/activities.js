import { myFetch } from "../helpers.js"

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
  const data = result.value

  data.map((item) => {
    item.StartDate = item.StartDate.replace("+01:00", "+00:00")

    item.Time = new Date(item.StartDate).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })

	item.Stamp = Math.round(new Date(item.StartDate).getTime() / 1000)
    
	data.sort((a, b) => {
		if(a.StartDate === b.StartDate) {
			return a.Education < b.Education ? -1 : 1
		} else {
			return a.StartDate < b.StartDate ? -1 : 1
		}
	})

  })

  let acc_html = `
			<table>
				<tr>
					<th>Kl.</th>
					<th>Uddannelse</th>
					<th>Hold</th>
					<th>Fag</th>
					<th>Lokale</th>
				</tr>`

  let activities = []
  activities.push(
	...data.filter(
		elm => elm.Stamp + 3600 >= curstamp && elm.Stamp < nextdaystamp
	)
  )

  if(config.max_num_activities) {
	activities = activities.slice(0, config.max_num_activities)
  }

  console.log(activities);
}
