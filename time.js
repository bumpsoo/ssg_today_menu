
const get_month = (date) => {
	return String(date.getMonth() + 1).padStart(2, '0')
}

const get_day = (date) => {
	return String(date.getDate()).padStart(2, '0')
}

const get_hours = (date) => {
	return String(date.getHours()).padStart(2, '0')
}

export const for_schedule = (date) => {
	const year = date.getFullYear()
	const month = get_month(date)
	const dat = get_day(date)
	const hour = get_hours(date)
	const minute = date.getMinutes()
	const second = date.getSeconds()
	return `${year}-${month}-${dat}T${hour}:${minute}:${second}`
}

export const for_menu = (date) => {
	const year = date.getFullYear()
	const month = get_month(date)
	const dat = get_day(date)
	return `${year}${month}${dat}`
}

export const add_minutes = (date, minute) => {
	return new Date(date.getTime() + minute * 60000)
}

export const for_display = (date) => {
	const year = date.getFullYear()
	const month = get_month(date)
	const dat = get_day(date)
	return `${year}년 ${month}월 ${dat}일`
}
