# Frontstart

A Modular Front-End Tooling System

![Frontstart](https://raw.github.com/gionkunz/frontstart/master/src/images/frontstart-tools.jpg "Tools")

This node based web stack is a front-end tooling ecosystem that provides the following functionality to the developer:

* Templating using Handlebars (assemble.io) with layouts and partials
* Performance best practices with ciritcal CSS and async JS
* Modularization in the forntend using browserify
* Component based approach for templates, styles and scripts
* Image resource compression (jpg, png, gif)
* JS linting with JSHint
* Javascript & CSS minification
* Connect webserver with livereload
* Test runner with BDD short feedback loop including cross-browser testing and code coverage reporting
* Sass pre-processing with libsass / node-sass
* Bower dependency management
* Grunt task runners for development and distribution
* Automated documentation building with JSDoc
* Automated styleguide generation with pre-defined styleguide components
* Single source of truth for documentation, styleguide and test fixtures

## Pre-requisites

In order to use this stack Node.js and NPM needs to be installed on your machine.

Also it's assumed that you have GIT installed.

> If you're running with a Linux environment you might want to change the max file handles a user can allocate. The
web stack uses grunt-watch which is heavily relying on open file handles.
`echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`

### Node.js

On Linux (Ubuntu, Fedora, OS X etc.) I recommend you to use NVM (node version manager) to install node. This allows you
to later on switch the node version individually if you need to.

With `curl`

    curl https://raw.github.com/creationix/nvm/v0.4.0/install.sh | sh

With `wget`

    wget -qO- https://raw.github.com/creationix/nvm/v0.4.0/install.sh | sh

After installing NVM you need to start a new terminal or `source ~/.nvm/nvm.sh`

Now, you can install any version of Node by using nvm:

    nvm install 0.10

Or switch to an already installed version so it will be set as your system wide version:

    nvm use 0.9

For more options visit https://github.com/creationix/nvm

## Installation of Frontstart

You can clone the repository and install Frontstart with the following steps:

    git clone https://github.com/gionkunz/frontstart.git
    cd frontstart
    npm install -g bower grunt-cli
    npm install
    bower install

## Usage

You can use the stack in two modes. You can run it as a server for development with livereload or you can use the stack
to build a package ready for distribution.

### Distribution build

If you want to produce a distribution ready release of your code there will be a few tasks that should run before. This
includes unit testing, minification, JS linting, concatination etc. To build a distribution package you can run the
default task by just running grunt:

    grunt

### Live development mode

Run the following command to run the stack in server mode:

    grunt live

This will run a webserver on your local machine on port 9000 and automatically start your browser to the index of the
web project you're creating. It also has livereload that will trigger the browser to reload once you've saved changes
to your project.

> If you'd like to use a different port or use a different binding hostname than the broadcast address 0.0.0.0 you can
  configure it in the Package.json config section. On Windows there are issues when using the broadcast address and it's
  recommended that you change the hostname to localhost.

#### Server running from your distribution build

Sometimes you'd like to see the end result of your development served by a web browser before you publish your
distribution. For those situations you can use a grunt task target that will trigger a build and then start Connect
on the `dist` folder instead of your development state. This helps you to detect issues that may relate to compressed
resources or reeving.

    grunt dist:preview

## Continuous Integration Server

The Frontstart development stack is optimized for Continuous Integration including the creation of XML test results 
that can be parsed by a CI server. It will generate the following output files (some of them will be created per browser for 
cross browser QA)

* JUnit test result XML generated by Karma (per browser)
* Cobertura code coverage report XML generated by Istanbul (per browser)
* Checkstyle XML generated by JSHint

## Automated documentation generated from comments

You should use JSDoc annotations to document your Javascript. All major IDE's are supporting auto-completion and
even construct documentation automatically based on analysis.
The development stack includes a grunt task that builds documentation automatically from your annotated Javascript files and
tests. The documentation is available in the generated api.html file.
