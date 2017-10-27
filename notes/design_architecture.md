# Design/architecture

Short, informal, overview of the overall design and architecture of the system. 

## Client side router
The backbone app router catches the query string in the following URL. 

[http://127.0.0.1:9000/#transcription?id=vid-2017-10-03](127.0.0.1:9000/#transcription?id=vid-2017-10-03)

## `GET` json transcription
gets the ID, and uses that to query the back-end server and retries a word level timecoded json. 

```json
{
    "meta": {
        "id": "BBY-2017-08-29",
        "date": "2017-08-29",
        "ticker": "BBY",
        "status": "raw",
        "call_type": "read",
        "media_type": "audio",
        "version": "1507150455",
        "media_file": "https://storage.googleapis.com/factsquared-earning-calls/BBY-2017-08-29.mp3"
    },
    "paragraphs": [
        {
            "seq": 0,
            "speaker": "Operator",
            "text": "Please stand by we are about to begin7n. Please stand by we are about to begin. Ladies and gentlemen, thank you for standing by. Welcome to Best Buy Second Quarter Fiscal 2018 Earnings Conference Call. At this time, all participants are in a listen-only mode. Later, we will conduct a question-and-session. [Operator Instructions] As a reminder, this call is being recorded for playback, and will be available by approximately 11 a.m. Eastern Time today. [Operator Instructions] As a reminder, this call is being recorded. I will now turn the conference call over to Mollie O'Brien, Vice President of Investor Relations.",
            "start": "0.000",
            "end": "49.640",
            "confidence": null,
            "words": [
                {
                    "seq": 0,
                    "word": "Please",
                    "sub_start": "0.000",
                    "sub_end": "1.000",
                    "confidence": 0.80
                },
                {
                    "seq": 1,
                    "word": "stand",
                    "sub_start": "1.000",
                    "sub_end": "1.320",
                    "confidence": 0.95
                },
                ....
```


Confidence scores and speakers are then displayed to the users in content edidtable where they can edit the text, in a "plain text" type of writing experience. 

Other [features](./features.md) are also available to the user.

## Saving 

Every five minutes the client saves intermediate results to the server.

However locally, changes are saved every 15 seconds, in `localStorage`. For speed and ease of development, using [himalaya](https://github.com/andrejewski/himalaya) HTML inside the text editor content editable is converted to json before saving. 

When the user, leaves and come back, or reloads the page for that matter.

The app checks if a local version is present. If it is, it 	loads it from `localStorage`. In this case confidence scores are preserves.

If for whatever reason it is not, then it loads it from the server. In this case confidence scores are missing.

Users have the option to click a button to trigger an intermediate save, in case they are about to leave a session and want to make sure it has been saved.

Users can click a final save button when they are done working on a transcription. 
## Saving onto the server

With this approach Intermediate saves and final saves are generally a one way `PUT` request to the server.

Server side the text is received as array of sequences in the parafraph attribute with speakers and text attribute, as well as sequence number. 

Server side this is then realigned using Aeneas, reintroducing word accurate timecodes. similar to the json payload of the initial GET.

```json 
{
 
  "id": "BBY-2017-08-29",
  "meta": {
  "status": "in progress",
  "source": "Copy Desk",
  "editor": "",
  "api_key": "bc43049b-83b9-4dea-bd60-a149e3786f5c",
    "id": "BBY-2017-08-29",
    "date": "2017-08-29",
    "ticker": "BBY",
    "status": "raw",
    "call_type": "read",
    "media_type": "audio",
    "version": "1506905510",
    "media_file": "https:\/\/storage.googleapis.com\/factsquared-earning-calls\/BBY-2017-08-29.mp3"
  },
  "paragraphs": [
    {
      "speaker": "Operator",
      "text": "Please stand by we are about to begin7n. Please stand by we are about to begin. Ladies and gentlemen, thank you for standing by. Welcome to Best Buy Second Quarter Fiscal 2018 Earnings Conference Call. At this time, all participants are in a listen-only mode. Later, we will conduct a question-and-session. [Operator Instructions] As a reminder, this call is being recorded for playback, and will be available by approximately 11 a.m. Eastern Time today. [Operator Instructions] As a reminder, this call is being recorded. I will now turn the conference call over to Mollie O'Brien, Vice President of Investor Relations.",
      "seq": 0
    },
    {
      "speaker": "Operator",
      "text": "Good morning. And thank you. Joining me on the call",
      "seq": 1
    },
    ...

 ```

 ## Client side parsing

 Client side, for speed and ease, the text is parsed using `innerText` method on the content editable div element, and then parsed to group speakers and following text sequentially. 
 using the [parsing module in the lib folder](../src/lib/parse_edited_text/index.js)

 speakers are identified as being wrapped by `~`.

## A different approach

 This is a dramatically different approach from having to keep an accurate representation of the transcription client side, that would require taking into account a lot of different edge cases when dealing with users typing inside a content editable. eg is this key inside or outside the span div that represents the words etc..

 As mentioned this approach relies on having aeneas, super fast aligner, server side to do some of the ground work for us. 

