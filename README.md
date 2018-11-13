## Rensselaer Parking-Ticket Appeal Management System ##
-------------

This web-application will be utilized by the Rensselaer community to file and review parking ticket appeals. The application's dependency management in handled in NPM.

_Authored by:_
 - Aaron J. Shapiro
 - Alex Ford
 - Dylan L. Cheung
 - Joshua Berman
 - William Zawilinski
 
----------

Development Environment
-------------

The latest version of [Node.js](https://nodejs.org/en/) > _(v8.0.0)_ should be installed on your system. If you are using Windows and are having a hard time installing the latest version, please consider using [Node Version Manager](https://github.com/creationix/nvm).

#### Dependency Installation
Install PostgreSQL version 10. Installiation instructions are here: [PostgreSQL Downloads](https://www.postgresql.org/download/)
Once all system-dependencies are installed, run`npm install`

#### Environment Variables
The configuration system utilizes the `NODE_ENV` environment variable to determine which configuration file to look for. _(The value should be 'development')_
> **Setting an Environment Variable:**
> _On a Mac:_
> 1. Edit the file at the following path `~/.bash_profile`
> 2. Append the following line to the end of the file `export NODE_ENV=development`
> 3. Run the following command or restart terminal `source ~/.bash_profile`
> 
> _On Windows:_
> 1. Open the command prompt.
> 2. Run the following command `setx NODE_ENV "development"`
> 
> _On Linux_:
> 1. Edit the bash profile in ~.
> 2. Append the following line to the end of the file `export NODE_ENV=development`
> 3. Run source on your bash profile or restart the terminal. 

#### Configuration

 1. Copy the contents `default.json` from the `config` folder and create a `development.json` file in the same directory.
 2. Fill out the configuration file as necessary, i.e. configure the database.
 
 Once the configuration is set up, run "npm run dev" from the root directory of the project.

----------

Production Releases
-------------

 1. Configure a `production.json` file in the `config` directory.
 2. Run `npm run build` from the root directory of the project.