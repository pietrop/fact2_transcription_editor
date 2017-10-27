## Integration 

Because as mentioned the authentication is done server side with sessions, all you need to connect to the editor is 

1. Modify in [`/src/config.js`](../src/config.js)  the `serverUrl` to whatevr endpoint you'll be using for the backend.. eg  [`http://factsquared.com/api/proofreader.php'`](http://factsquared.com/api/proofreader.php)
	- if you don't know what the end point is going to be, do step two, get the end point then cricle back to step 1.


2. deploy the [`/dist`](../dist) folder, and its content onto a static or dynamic sever.
	- You have obtrained the `dist` folder following the previous step `Build for deployment`.
	- Static server, such as github pages, AWS S3, or google cloud storage. you'd just add and paste the folder there.
	- dynamic server such as apache, you'd just serve it as you'd server a static html page, with associated client side js/css dependencies.

3. I am assuming you'll have alist of transcription on another page. For each add a link similar to this
	- [http://127.0.0.1:9000/#transcription?id=vid-2017-10-03](http://127.0.0.1:9000/#transcription?id=vid-2017-10-03)
	- `http://{{baseURL}}/#transcription?id={{videoId}}`
		- where `baseURl` and `videoId` are your custum fields that ensure each url arrivesat its corresponding version of the transcription editor.


That's it.
