import 'dotenv/config'
import { get_menu_payload } from "./menu.js"
import { send_webhook } from "./slack.js"
import { for_menu } from './time.js'
import { constants } from "./constants.js"
import { create_schedule } from "./schedule.js"

const response = (code, body) => {
	return {statusCode: code, body: JSON.stringify(body)}
}

const res_with_err = (res, err_msg) => {
	return response(res.statusCode ?? 200, {error: err_msg})
}

const parse_event = (event) => {
	if (event.slack_url != undefined) {
		return {
			date: event.date ?? for_menu(new Date()),
			slack_url: event.slack_url,
			count: event.count ?? 0
		}
	}
	return {error: constants.error.INVALID}
}

const send_slack_message = async (res, slack_url, payload) => {
	if (await send_webhook(slack_url, payload))
		return res
	else
		return res_with_err(res, constants.error.SLACK_FAIL)
}

const send_schedule = async (res, event)  => {
	if (await create_schedule(event.count, event.slack_url, event.date))
		return res
	else
		return res_with_err(res, constants.error.SCHEDULE_FAIL)
}

export const handler = async (event) => {
	process.env.TZ = 'Asia/Seoul';
	const res = response(200, 'ok');
	event = parse_event(event)
	if (event.error != undefined)
		return res_with_err(res, event.error)
	const payload = await get_menu_payload(event.date)
	console.log(JSON.stringify(payload))
	switch (payload.error) {
		case constants.error.INVALID:
			return res_with_err(res, payload.error)
		case constants.error.EMPTY_MENU:
		case constants.error.EMPTY_IMAGE:
			if (event.count < constants.MAX_RETRY) {
				return await send_schedule(res, event)
			} else {
				return await send_slack_message(res, event.slack_url, payload.body)
			}
		case undefined:
		default:
			return await send_slack_message(res, event.slack_url, payload.body)
	}
}
