Title: Twitter Shadowban Monitor
Date: 2021-05-23 12:00
Category: DevOps
Tags: monitoring, javascript
Slug: twitter-shadowban-monitor
Authors: Wojciech Bobrowski
template: article
thumbnail: images/thumbnails/newrelic.png
Summary: Twitter likes bans a lot, and more specifically shadowbans. It's very easy to get one as they are assigned by the built-in abnormal activity detection. They usually last 2-3 days, but users usually don't know it. So let's increase awareness by setting up the appropriate monitor.
## Introduction
Twitter likes bans a lot, and more specifically shadowbans. It's very easy to get one as they are assigned by the 
built-in abnormal activity detection. They usually last 2-3 days, but users usually don't know it, as it allows access 
to content of others, but blocks others to banned account. So let's increase awareness by setting up the appropriate monitor.
### Requirements
- Basic knowledge of javascript
- New Relic free/paid account
- Access to shadowban.eu
### Characteristic of API monitor
- It ignores 5* errors, so in case api backend is down we don't get notification
- It ignores accounts without tweets
- It alerts when account is shadowbanned (search ban, suggestion ban etc.)
- It alerts when account doesn't exist or was deleted.
#### Request
`https://shadowban.eu/.api/<USER>` it's the only url used by monitor.

`User-Agent` is required. Without it 403 forbidden status code appears in response.
#### Response types
Assuming the response is 200. Below are the typical json replies from the server:

@Account doesn't exists:
```
{"timestamp": 123456789.123456, "profile": {"has_tweets": false, "screen_name": "Account", "exists": false}}
```
@Account has no tweets:
```
{"profile": {"has_tweets": false, "exists": true, "screen_name": "Account", "protected": false}, "timestamp": 123456789.123456}
```
@Account is ok:
```
{"profile": {"has_tweets": true, "sensitives": {"possibly_sensitive": 0, "counted": 79, "possibly_sensitive_editable": 24}, "protected": false, "exists": true, "screen_name": "Account"}, "tests": {"search": "0123456789123456789", "typeahead": true, "ghost": {"ban": false}, "more_replies": {"error": "EUNKNOWN"}}, "timestamp": 123456789.123456}
```
@Account has shadowban
```
{"profile": {"has_tweets": true, "sensitives": {"possibly_sensitive": 0, "counted": 79, "possibly_sensitive_editable": 24}, "protected": false, "exists": true, "screen_name": "Account"}, "tests": {"search": "false", "typeahead": false, "ghost": {"ban": true}, "more_replies": {"error": "EUNKNOWN"}}, "timestamp": 123456789.123456}
```
It's not easy to notice, that in case of ban `search` key gets value `false`, but without ban it points to id of founded tweet `0123456789123456789` (from above example).
#### Monitor script
With proper research it's much easier to write a monitor script. It took me some time to understand 
API behaviour of this particular service. Feel free to copy and use below code. If you are not familiar with synthetic 
monitors in New Relic, go to [documentation](https://docs.newrelic.com/docs/synthetics/synthetic-monitoring/scripting-monitors/write-synthetic-api-tests/). 
It's nothing more than 2 clicks of the mouse. The only action here is changing variable `USER` with different account name.

Please set `period` time of monitor to something longer than 10 minutes. Site [shadowban.eu](https://shadowban.eu) is free
for everyone and shadowban lasts 2-3 days, so there is no need to know if ban is active
every 1 minute. Same with number of locations. One is enough, two should be max. Thank you.
```
/**
 * This NewRelic synthetic. Script checks if user is shadowbanned on twitter
 */
var USER = 'VV0JC13CH'
var URL = 'https://shadowban.eu/.api/' + USER;

var assert = require('assert');
var options = {
    //Define endpoint URL.
    url: URL,
    headers: {
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0',
    }};
$http.get(options, function(error, response, body) {
    console.log(response.statusCode + " status code")
    console.log(body)
    if (response.statusCode == 200){
        var json = JSON.parse(body)
        var test_exists = json["profile"]["exists"]
        var test_has_tweets = json["profile"]["has_tweets"]
        if (test_has_tweets== true && test_exists == true){
            console.log('@' + USER + ' account exists')
            console.log('@' + USER + ' has tweets')
            var test_search = json["tests"]["search"]
            var test_typeahead = json["tests"]["typeahead"]
            var ghost_ban = json["tests"]["ghost"]["ban"]
            if (test_search == false){
                console.log('Search Ban')
            }
            else{
                console.log('No Search Ban')
            }
            if (test_typeahead == false){
                console.log('Search Suggestion Ban')
            }
            else{
                console.log('No Search Suggestion Ban')
            }
            if (ghost_ban == true){
                console.log('Ghost Ban')
            }
            else{
                console.log('No Ghost Ban')
                assert.ok(test_exists != false, 'Account @' + USER + 'does not exist');
                assert.ok(ghost_ban != true, 'Ghost ban is ' + ghost_ban);
                assert.ok(test_search != false, 'Search ban is ' + test_search);
                assert.ok(test_typeahead != false, 'Search suggestion ban is ' + test_typeahead);
            }
        }
        else {
            assert.ok(test_exists != false, 'Account @' + USER + 'does not exist');
            console.log('Account has no tweets. Skipping shadowban tests.')
        }
    }
    else{
        // This script doesn't alert when API server is up or down:
        assert.ok(response.statusCode >= 500 && response.statusCode <= 520, response.statusCode + ' HTTP response status code');
    }

    }

);
```
#### Known limitation
If shadowban on Twitter is active and shadowban.eu will go down. Monitor is going to resolve incident and create next one
when API will be once again available. 

Good luck with bans! I hope you are kind to others :-)