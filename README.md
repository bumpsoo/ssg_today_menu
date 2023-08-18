## aws lambda + scheduler로 특정 시간에 메뉴(SSG 오늘의 메뉴) 알람

필요한 lambda 권한

- create schedule

필요한 scheduler 권한
- invoke lambda

메뉴 / 사진을 가져오지 못할 경우 15분 뒤에 다시 호출하도록 스케줄 설정

5번을 초과하여 재호출 될 시 메뉴 혹은 사진을 다시 가져오지 않고 슬랙 알람

```
{
  "slack_url": "web hook url"
  "date": "20230818"
  "count": 0
}
```
slack_url -> required
count, date -> optional
