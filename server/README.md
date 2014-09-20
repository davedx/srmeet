User profile schema example:
==

```
{
	"_id": "541d5f62b51af7310ccc4c51",
	"airport": {
		"name": "Malpensa",
		"city": "Milan",
		"country": "Italy"
	},
	"flight": {
		"number": "EZY2726",
		"date": "2014-09-20+01:00",
		"time": "13:40:00.000+01:00",
		"gate": "M01"
	},
	"profile": {
		"fb_user_id": "",
		"name": "Jane",
		"gender": "female",
		"age": "21",
		"country": "USA",
		"hometown": "Seattle",
		"picture_url": "http://fb.cdn.net/asjdioasjdoj.jpg"
	}
}
```

User/webservice flow:
==

1. After Facebook login, post profile data to create new profile on the server:

Example request:
```
POST /profiles/new
{
	"profile": {
		"fb_user_id": "1j123y8hu2i34ui",
		"name": "Jane",
		"gender": "female",
		"age": "21",
		"country": "USA",
		"hometown": "Seattle",
		"picture_url": "http://fb.cdn.net/asjdioasjdoj.jpg"
	}
}
```

Example response:
```
{
	"_id": "newMongoIDbigHexString",
	"etc.": "etc."
}
```

2. After user enters their flight number, post it to the server:

Example request:
```
POST /profiles/newMongoIDbigHexString/flight
{
	"flightNumber": "EZY2726"
}
```

Example response:
```
{
	"result": "OK"
}
```

Example error case:
```
{
	"result": "FLIGHT_NOT_FOUND"
}
```
