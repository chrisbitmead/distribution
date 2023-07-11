
# Overview of nsldist

The app consists of two parts, a web based client (in the client directory) 
based on Angular, and a server (in the server directory) based on Grails.

# Building the app

## Building in development

In Intellij the server portion should be ready to run automatically (hopefully),
and you can run it from the run menu by selecting Grails:server from the
run dropdown and clicking run (or debug).

The client portion can be run from a command prompt in the client directory 
by typing
```
ng serve
```

There's probably a way to get that to run in Intellij too, but I haven't
investigated that.

Note: ng is the angular cli command. If you are unfamiliar with Angular... 
You start by installing "node". The easiest way to do that is to first
install "nvm" (node version manager) (I recommend "nvm for windows" even 
if not on windows). From there install the version of node
you want:  (look in client/build.gradle: node.version to know what version
it was developed with)
```
nvm install v10.16.3
nvm use v10.16.3
```
Then use npm (node package manager) to install Angular:
```
npm install -g @angular/cli
```
and download your node packages
```
npm update
```
From here you should be ready to start the app:
```
cd client ; ng serve
```

Note that if you are using Windows it is recommended not to do this step
from a cygwin terminal, but rather a cmd terminal as cygwin has trouble
stopping it with CTRL-C, leaving your node running in the background
and causing issues.

## Building for deployment

To build the app for deployment:
```
./gradlew bootWar
```
(Note that while gradlew is part of the distribution, you'll need your
own java8 and to set JAVA_HOME so it can find it).

This will create two war files:
```
client/build/libs/angel.war (the Angular client)
server/build/libs/angel-server.war (the Grails server)
```
If you drop these into Tomcat/webapps, then by default they'll be accessible at
(depending on how you have Tomcat configured)
```
http://localhost:8080/nsldist
http://localhost:8080/nsldist-server
```
There are some files that are included in the Angular when run using ng serve
that are omitted from the distribution build. Namely the config
files in client/src/config
```
env.json
env.development.json
env.production.json
```
(They are omitted by the production setup in angular.json and by
making the default ng build have the -prod flag in package.json)
You need to make a copy of these, edit them appropriately, and arrange
for Tomcat to serve them separately. Edit env.json to reflect whether your 
distribution is for test or production. Then as appropriate edit
env.{environment}.json to set the apiHost parameter. This allows the client
to know where to find the server. So in a production environment it might
look something like:
```
{ 
"apiHost": "/nsldist-server"
}
```
To get Tomcat to serve these up statically and separately, edit your 
{Tomcat}/conf/server.xml file, find your Hosts section and add the following
context:
```
    <Host name="localhost"  appBase="webapps" unpackWARs="true" autoDeploy="true">
        <Context docBase="config" path="/fap/config" cachingAllowed="false"/>
    </Host>
```
This says to Tomcat to find the directory call "config" under your appBase
Directory (i.e. webapps) and serve it up to the world as "/fap/config". 
The application is going to expect to find these files at context-root/config/env.json
and by default its context-root will be fap.

Now create a directory and drop your config files there:
```
mkdir webapps/config
cp env.json env.production.json webapps/config
cp {client,server}/build/libs/fap*.war webapps
```
Now you should be able to access your config files at:
>/nsldist-server/config/env.json

and your server api at:
> /nsldist-server

and your user application at:
> /nsldist

## Installing updated GIS files

There is an extra gradle target: "generateJson" that will connect to the shared drive 
where new KML gis files are stored, pull down a new kml file, convert it to json ready
to build. It is suggested to run this when a new GIS file is created, and checkin the
new sections.json and water_sprinklers.json. ( The gradle target doesn't check in the 
new files. Some experimentation was done into doing this, but I think that's probably
not a good idea).

To download and build, run this:
```
gradlew clean generateJson war
```

You can also download new GIS files and build and install in one go using Jenkins,
albeit the new json files won't be checked into GIT. See below. 

## Building in Jenkins

There are some Jenkins tasks setup:
```
FAP-test - builds and deploys to test
FAP-test-newgis - download new GIS files, build and deploy to test
FAP-staging - builds for staging (but deployment doesn't work due to problems with staging machine config)
FAP-staging-newgis - - download new GIS files, build and deploy to staging
FAP-prod - copies staging build to prod. (requires building FAP-staging first)
```
