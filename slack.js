import { constants } from "./constants.js"

const mrkdwn_section = (text) => {
	return {
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: text
		}
	}
}

const image_section = (text, img_url) => {
	return {
		type: 'image',
		title: {
			type: 'plain_text',
			text: text
		},
		image_url: img_url,
		alt_text: text
	}
}

const menu_to_mrkdwn = (data) => {
	const ret = "*" + constants.MEAL_TIME + ":* " + data[constants.MEAL_TIME] +
		"\n*" + constants.MEAL_TYPE + ":* " + data[constants.MEAL_TYPE] +
		"\n*" + constants.REP_MENU + ":* " + data[constants.REP_MENU] +
		"\n*" + constants.DETAILED_MENU + ":* " + data[constants.DETAILED_MENU] +
		"\n*" + constants.CALORY + ":* " + data[constants.CALORY] + "\n"
	return ret
}

export const data_for_slack = (date, data) => {
	let ret = {'blocks': [mrkdwn_section('*'+ date + ' 일자 메뉴*')]}
	data.forEach((value) => {
		ret['blocks'].push(mrkdwn_section(menu_to_mrkdwn(value)))
		if (value[constants.MENU_IMAGE])
			ret['blocks'].push(image_section(value[constants.REP_MENU], value[constants.MENU_IMAGE]))
		else
			ret['blocks'].push(mrkdwn_section('이미지 ' + constants.error.NO_DATA))
	})
	return ret
}

export const send_webhook = async (slack_url, data) => {
	const res = await fetch(
		slack_url,
		{
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(data)
		}
	)
	const text = await res.text()
	return text == 'ok'
}
