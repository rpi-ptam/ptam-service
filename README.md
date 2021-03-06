<h2 align="center">Rensselaer Parking-Ticket Appeal Management System - Service</h2>
<p align="center">
  <a href="https://travis-ci.org/rpi-ptam/ptam-service"><img src="https://travis-ci.org/rpi-ptam/ptam-service.svg?branch=master" alt="TravisCI Build Status"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://codeclimate.com/github/rpi-ptam/ptam-service/maintainability"><img src="https://api.codeclimate.com/v1/badges/ff38ae6a8f36866d5eae/maintainability"/></a>
  <a href="https://codeclimate.com/github/rpi-ptam/ptam-service/test_coverage"><img src="https://api.codeclimate.com/v1/badges/ff38ae6a8f36866d5eae/test_coverage" /></a>
</p>

> This repository is the backend component of a web-application - for filing and reviewing parking ticket appeals - that will be utilized by the Students at <a href="https://rpi.edu" target="_blank">RPI</a>.

_Authored by:_
 - Aaron J. Shapiro
 - Dylan L. Cheung
 - Joshua A. Berman
 - William Zawilinski
 
----------

Development Environment
-------------

The latest version of [Node.js](https://nodejs.org/en/) > _(v8.0.0)_ should be installed on your system. If you are using Windows and are having a hard time installing the latest version, please consider using [Node Version Manager](https://github.com/creationix/nvm).


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
> 1. Edit the .bash_profile or .bashrc in your home directory.
> 2. Append the following line to the end of the file `export NODE_ENV=development`
> 3. Run source on your bash profile or restart the terminal. 

#### Configuration

 1. Copy the contents `default.json` from the `config` folder and create a `development.json` file in the same directory.
 2. Fill out the configuration file as necessary, i.e. configure the database.
 
 ### Generating Authentication Signature-Keys: 
 It's recommended to use an elliptic curve algorithm:
 - `openssl ecparam -genkey -name secp384r1 -noout -out auth_signatures.pem` 
 - `openssl ec -in auth_signatures.pem -pubout -out auth_signatures_public.pem`
 - Copy the values from both of these outputs into your configuration file. Since JSON doesnt allow multiple lines remove them from the keys but replace them with `\n`.
 
 Once the configuration is set up, run `npm run dev` from the root directory of the project.

----------

Production Releases
-------------
This codebase strives to maintain a [stateless API](https://restfulapi.net/statelessness/) and therefore can scale up horizontally with additional instances through clustering or [reverse-proxying](http://nginx.org/en/docs/http/load_balancing.html) with [NGINX](http://nginx.org). Also be sure to run the corresponding [migrations](https://github.com/rpi-ptam/schematron) on the intended database.

 1. Configure a `production.json` file in the `config` directory.
 2. Run `npm run build` from the root directory of the project.
