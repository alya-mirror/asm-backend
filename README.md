# asm-backend
The backend for [alya-smart-mirror](https://github.com/alronz/alya-smart-mirror)  
# Getting Started 
For using [alya-smart-mirror](https://github.com/alronz/alya-smart-mirror) you have to run the backend in the raspberry pi of the mirror or in any device connected to the same gatway as the app and Alya .

* Perquisites :

1-mongodb :  make sure you have mongodb and run 'mongod' in the terimnal 

2-AWS IoT : make sure you have configured AWS IoT as shown [here](https://github.com/alya-mirror/asm-youtube-addon-skill/blob/master/documentation/awsIOT.md).

* usage :

download the project then do the following commands :

```
$ npm install 
```
```
$ node index.js
```
# Technical details
The backend provide the communication between the mirror and the app and it also handle the data management for the users , user addons and for the addons settings. 
* General scenario 
<img width="979" alt="screenshot at mar 04 17-22-21" src="https://user-images.githubusercontent.com/21360696/36948909-ae1f2af4-1fe1-11e8-9820-27d3e54c12b2.png">

* All detailed scenario [here](https://github.com/alya-mirror/asm-backend/blob/master/docs/detailedScenarios.md) 
# Services Used
The backend is built on nodejs and it uses some services such as mongodb for handling the database and bcrypt for password encryption .
For the communication we are using HTTP endpoints , socket and aws mqtt as in the picture below :
<img width="968" alt="tech design" src="https://user-images.githubusercontent.com/21360696/36948925-d81cc302-1fe1-11e8-83b3-a25fe1417992.png">
