/**
 * Funktion til at fetche fra API
 * @param {String} url
 * @param {Object} options
 * @returns Objekt med resultater
 */
export const myFetch = async (url, options = null) => {
  // Deklarerer var til server svar
  let response

  // Try/Catch
  try {
    // Ternary value: hent med eller uden options
    response = !options ? await fetch(url) : await fetch(url, options)

    // Parser server svar som json
    const result = await response.json()

    // Retunerer resultat
    return result
  } catch (err) {
    console.error(`Der er fejl i myFetch: ${err}`)
  }
}

/**
 * Dansk navn for ugedag
 * @param {Number} intDay
 * @returns Streng med navn på ugedag
 */
export const day2dk = (intDay) => {
  let day
  switch (intDay) {
    default:
      break
    case 0:
      day = "Søndag"
      break
    case 1:
      day = "Mandag"
      break
    case 2:
      day = "Tirsdag"
      break
    case 3:
      day = "Onsdag"
      break
    case 4:
      day = "Torsdag"
      break
    case 5:
      day = "Fredag"
      break
    case 6:
      day = "Lørdag"
      break
  }

  return day
}

/**
 * Dansk navn for måned
 * @param {Number} intMonth
 * @returns Streng med navn på måned
 */
export const month2dk = numMonth => {
  const arrDkMonthNames = [
    "Januar",
    "Februar",
    "Marts",
    "April",
    "Maj",
    "Juni",
    "Juli",
    "August",   
    "September",
    "Oktober",
    "November",
    "December",
  ]
 
  return arrDkMonthNames[numMonth]
}

/**
 * sætter læsevenl igt dato format
 * @param {String} strDate
 * @returns String - Eksempel: Mandag d. 1. Januar
 */
export const dayMonth2dk = strDate => {
  const date = new Date(strDate)
  return `${day2dk(date.getDay())} d. ${date.getDate()}. ${month2dk(
    date.getMonth()
  )}`
}

/**
 * Konverterer en strengs første bogstav til uppercase 
 * @param {String} str 
 * @returns Streng 
 */
export const capitalizeFirstLetter = strWord => {
  return strWord.charAt(0).toUpperCase() + strWord.slice(1)
}
