
## Dev test on mobile 
or other devices on local network 

>(If you're on a Mac )

in webpack config, the webpack-dev-server already runs on `--host 0.0.0.0` — this lets the server listen for requests from the network, not just localhost.

>Find your computer's address on the network. In terminal, type ifconfig and look for the en1 section or the one with something for example inet 192.168.1.111

>In your mobile device on the same network, visit for example http://192.168.1.111:9000 and enjoy hot reloading dev bliss.

[see stackoverlow ](https://stackoverflow.com/questions/35412137/how-to-get-access-to-webpack-dev-server-from-devices-in-local-network)

full URL has `/#transcription?id=vid-2017-10-03`



### if using the mock api dev server
for this to work, one more change is needed. 


go in `mock_api_dev_server`

in `sample2.json` change media file attribute to be something like this `"media_file": "192.168.1.5:3000/public/vid-2017-10-03.mp4"`

where the ip address is the one we got with `ifconfig` for `en0` and the port is the one specified in `mock/api_dev_server/index.js` so `30000`.

