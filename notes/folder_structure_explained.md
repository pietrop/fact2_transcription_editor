
## Folder structure 

```bash
.
├── README.md
├── mock_api_dev_server
│   ├── index.js
│   ├── public
│   │   └── vid-2017-10-03.mp4
│   └── sample.json
├── node_modules
│   └── ....
├── package.json
├── src
│   ├── app
│   │   ├── app.js
│   │   ├── collections
│   │   ├── helpers.js
│   │   ├── models
│   │   │   └── transcription.js
│   │   ├── router.js
│   │   ├── templates
│   │   │   └── transcription_show.html.ejs
│   │   └── views
│   │       └── transcription_view.js
│   ├── config.js
│   ├── index.html
│   ├── lib
│   │   ├── parse_edited_text
│   │   │   ├── index.js
│   │   │   └── index.test.js
│   │   └── timecode_converter
│   │       ├── README.md
│   │       ├── index.js
│   │       └── index.test.js
│   ├── style.css
│   └── toggle_switch.css
└── webpack.config.js
```

### Mock API dev server

An express server that mocks the GET API end point for development purposes.  
Video file not included in the github repo. `vid-2017-10-03.mp4`. 

### `src` 
Is where the code for the app is. 
when compiling, it will be packaged in a `dist` folder at the root of this project. 
That folder is what will be used for deployment/delivery on a static server, or to serve from a dynamic one.

```bash
├── src
│   ├── app
│   │   ├── app.js
│   │   ├── collections
│   │   ├── helpers.js
│   │   ├── models
│   │   │   └── transcription.js
│   │   ├── router.js
│   │   ├── templates
│   │   │   └── transcription_show.html.ejs
│   │   └── views
│   │       └── transcription_view.js
│   ├── config.js
│   ├── index.html
│   ├── lib
│   │   ├── parse_edited_text
│   │   │   ├── index.js
│   │   │   └── index.test.js
│   │   └── timecode_converter
│   │       ├── README.md
│   │       ├── index.js
│   │       └── index.test.js
│   ├── style.css
│   └── toggle_switch.css
```

#### `index.html`

Main entry point is `index.html`.  [Webpack](http://webpack.js.org) is used to package and bundle the client side javascript together. This are added as `dist/bundle.js` file, which is what we require inside `index.html`.

#### `app`

The [backbone](http://backbonejs.org) app is in the `app` folder as the name sudgests. with entry point at `src/app/app.js`, where the client side backbone router is initialized. 

Rest of the app folder structure contains `collections`, `models`, `router`, `views` and `templates`.

#### `lib`
Lib folder contains other modules used by the app, eg to conver timecodes or convert text from the editor to send back to the sever.

#### `config.js`

`config.js` contains info on the server url base end point, and API key for the communication with the back end. 

When ready to deploy, change the `serverUrl` to whatevr endpoint you'll be using for the backend.. eg  `http://factsquared.com/api/proofreader.php'`

```js
serverUrl: 'http://127.0.0.1:3000/api/proofreader.php',
// serverUrl: 'http://factsquared.com/api/proofreader.php', 
```

The backend server implements server side authentication with sessions, so altho the API key is exposed in client side javascript, and not a best practice, this should not constitute major security breach (?). 
