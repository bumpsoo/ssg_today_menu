import { constants } from "./constants.js"
import { data_for_slack } from "./slack.js"

const get_menu = async (date) => {
	const res = await fetch(
		'https://sfmn.shinsegaefood.com/selectTodayMenu2.do',
		{
			method: 'POST',
			headers: {
				'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
				'Content-Type': 'application/json',
				'Referer': 'https://sfmn.shinsegaefood.com/selectTodayMenu.do',
			},
			body: JSON.stringify({
				menuDate: String(date),
				storeCd: constants.STORE_NUMBER,
				cafeCd: '01',
				dispBaseCd: '0',
				userLang: 'K'
			})
		}
	)
	return await res.json()
}

const parse_menu_data = (json_data) => {
	let ret = [];
	for (const value of json_data) {
		if (value['WEB_LINK'] == null) {
			return {error: constants.error.EMPTY_IMAGE}
		}
		ret.push({
			[constants.MEAL_TIME]: value['MEAL_TYPE_NM'],
			[constants.MEAL_TYPE]: value['DINNER_TYPE_NM'],
			[constants.REP_MENU]: value['REP_MENU_NM'],
			[constants.DETAILED_MENU]: value['MENU_DESC'],
			[constants.CALORY]: value['TOT_CALORY'],
			[constants.MENU_IMAGE]: 'https://store.shinsegaefood.com/' + value['WEB_LINK']
		})
	}
	return ret;
}

export const get_menu_payload = async (date) => {
	const menu = await get_menu(date)
	if (!menu)
		return {error: constants.error.INVALID}
	if (menu.model.model.length == 0)
		return {error: constants.error.EMPTY_MENU}
	console.log(menu.model.model)
	const parsed = parse_menu_data(menu)
	if (parsed.error != undefined)
		return {error: constants.error.EMPTY_IMAGE}
	const payload = data_for_slack(date, parsed)
	return payload
}
