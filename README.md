# Webmin.js - A Node.js replacement for Webmin #

The PERL based [Webmin](http://www.webmin.com/) tool provides a web-based adminsitration tool for Linux servers. It is an excellent tool but rather over-complex - the Apache admin module for example is far more complex to use than editing the raw config files even for beginners. Additionally, many of the modules don't seem to get updated regularly.

Webmin.js is my first proper experiment with [Node.js](http://nodejs.org). I wanted to reproduce and enhance the parts of webmin that I really want and to see how easy this might be using Node.

> Note that this is very much a part-time project. I am not a "developer", I use programming to support my various roles as an IT consultant & contractor. So it will likely be a long time before this is anything more than a "garden shed" project.

## What Is Currently Implemented? ##
* Creates an https server assigned to a free port (starting at 8000)
* Uses an external js file (example included as [./docs/.secureme.example](docs/.secureme.example)) that can be require'd to provide certificate and http basic authentication details.
* Uses a simple JSON variable to create a menu of links
* Provides a [package.json](package.json) file for npm installation. You can check out the [github project](https://TotallyInformation@github.com/TotallyInformation/webmin.git) and run `npm install -d` at the command prompt to get the dependencies.
* Commands currently implemented:

  * `utime` - shows the output of the `uptime` shell command
  * `top` - shows the output of a single top (`top -b -n 1`) shell command
  * `ports` - shows the output of lsof and netstat showing open ports on the system
  * `cmdexec` - input any shell command and return the output to the browser
     * Currently has limited buffer capability (easily exceeded by a large `aptitude search` for example)
     * Has **NO** input checking yet! You've been warned!

## Not Yet Done ##
Some of the other things I want to do:

* Service checker using a simple JSON configuration to check that multiple services are working properly (e.g. web, email, database)
* Log viewer. Although [log.io](http://log.io) looked promissing it doesn't get kept up-to-date against Node so it's no use to me
* File editor - possibly grouped by services so that you can see all of the relavent files for a server service, website, etc. - Probably will include live syntax highlighting (as at github).
* Aptitude - update, search, show (details), install and uninstall Linux applications (Debian/Ubuntu)
* npm - update, search, show (details), install and uninstall Node.js modules
* PECL - update, search, show (details), install and uninstall PHP modules
* Service restarter - automatically list the available services (Debian) with button(s) to restart the services - maybe also add a marker (or colour) to show if they are running
* Change from a simple client/server interaction model to an AJAX one, possibly using [socket.io](http://socket.io/)

Feel free to add other suggestions by raising an "Issue" on the github project ([TotallyInformation/webmin](https://github.com/TotallyInformation/webmin))

## License ##
<a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-sa/3.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/InteractiveResource" property="dct:title" rel="dct:type">Webmin.js</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://www.totallyinformation.com" property="cc:attributionName" rel="cc:attributionURL">Julian Knight (Totally Information)</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-ShareAlike 3.0 Unported License</a>.<br />Based on a work at <a xmlns:dct="http://purl.org/dc/terms/" href="https://TotallyInformation@github.com/TotallyInformation/webmin.git" rel="dct:source">TotallyInformation@github.com</a>.