import { SchedulerClient, CreateScheduleCommand } from "@aws-sdk/client-scheduler"
import { for_schedule, add_minutes } from "./time.js";

const GROUP_NAME = 'default'

const getRandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min)) + min
}

export const create_schedule = async (count, slack_url, date) => {
	const client = new SchedulerClient();
	const dt = for_schedule(add_minutes(new Date(), 15))
	const rand = getRandomInt(1, 100000000)
	const createInput = {
		Name: `one_time_schedule_${rand}`,
		GroupName: GROUP_NAME,
		FlexibleTimeWindow: {Mode: 'OFF'},
		ActionAfterCompletion: 'DELETE',
		State: 'ENABLED',
		ScheduleExpression: `at(${dt})`,
		ScheduleExpressionTimezone: 'Asia/Seoul',
		Target: {
			Arn: process.env.LAMBDA_ARN,
			RoleArn: process.env.SCHEDULE_ROLE_ARN,
			Input: JSON.stringify({
				count: count + 1,
				slack_url: slack_url,
				date: date
			}),
			RetryPolicy: {
				MaximumRetryAttempts: 0
			},
		}
	}
	const res = await client.send(new CreateScheduleCommand(createInput))
	console.log(res)
	return res.ScheduleArn != undefined
}
