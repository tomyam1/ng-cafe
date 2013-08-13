



/**
 *
 seleniumServerJar: './selenium/selenium-server-standalone-2.33.0.jar',

 // The port to start the selenium server on, or null if the server should
 // find its own unused port.

 seleniumPort: 4444,

 // Additional command line options to pass to selenium. For example,
 // if  you need to change the browser timeout, use
 // seleniumArgs: [-browserTimeout=60],

 seleniumArgs: [],

 // The address of a running selenium server.
 seleniumAddress: 'http://localhost:4444/wd/hub',

 // Chromedriver location is used to help the selenium standalone server
 // find chromedriver. This will be passed to the selenium jar as
 // the system property webdriver.chrome.driver. If null, selenium will
 // attempt to find chromedriver using PATH.

 chromeDriver: './selenium/chromedriver',

 // ----- Capabilities to be passed to the webdriver instance.
 // For a full list of available capabilities, see
 // https://code.google.com/p/selenium/wiki/DesiredCapabilities

 capabilities: {
                    'browserName': 'chrome'
                }
 *
 *
 * @param grunt
 */
module.exports = function (grunt) {

    var webdriver = require('protractor/node_modules/selenium-webdriver');
    var remote = require('protractor/node_modules/selenium-webdriver/remote');
    var fs = require('fs');

    grunt.registerMultiTask('webdriver',
        'start and stop the selenium-server-standalone-*.jar',
        function () {
            // I need to know where the selenium server is.
            this.requiresConfig('webdriver');

            var done = this.async();

            getConfig(grunt, this);
            var data = this.data;

            console.log("options\n",this.options());
            console.log("data\n",data);

            //var done = this.async();

            if (!data.seleniumAddress && (!data.port || !data.host) ) {
                throw Error("need either a server address for an existing server or a hostname and jar file of a server to start.");
            }

            if (data.seleniumServerJar) {
                if (!fs.existsSync(data.seleniumServerJar)) {
                    throw Error("The specified jar does not exist: " + data.seleniumServerJar );
                }
                data.seleniumAddress = 'http://' + data.host + ':' + data.port + '/wd/hub';
                // create new remote server
            } else {
                // get connection to running server
            }

            console.log('\n======== this\n',this,'\n--- options\n',this.options());

            var msg = '';
            this.args.forEach(function(arg){
                switch(arg.toLowerCase()) {
                    case 'start': msg = "==== START THE SERVER ===="; break;
                    case 'stop': msg = "--- STOP THE SERVER ---"; break;
                    case 'info': msg = options; break;
                    case 'help':
                        msg = "start, stop, info"; break;
                    default:
                        if (options.start || data.start) {
                            msg = "====> START THE SERVER ===="
                        } else if(data.stop ) {
                            msg = "---> STOP THE SERVER ---"
                        }
                }
                console.log(msg);
            });
            // start and stop web driver
            //execute


            // How to wait for tests to complete before stopping the server?
            if (this.data.stop) {
                console.log('\n=============--- STOPPING THE SELENIUM SERVER ---=============\n');
            }
        }
    );

    function getConfig(grunt, task) {

        console.log("task: ", task);

        var options = task.options({ port: 4444 });
        var data = task.data;
        var args = parseArgs(task.args);
        var config = grunt.util._.merge(options, data);

        // command-line, target:option, data, options
        config.port = grunt.option('port') || args.port || config.port;
        config.host = grunt.option('host') || args.host || config.host;
        config.seleniumServerJar = grunt.option('seleniumServerJar') || args.seleniumServerJar || config.seleniumServerJar;
        config.seleniumAddress = grunt.option('seleniumAddress') || args.seleniumAddress || config.seleniumAddress;

        task.data = config;
    }

    function parseArgs(taskArgs) {
        console.log("parse :",taskArgs);
        args = {};
        if (!taskArgs || taskArgs.length <= 0) {
            return args;
        }
        for(var i in taskArgs) {
            var arg = taskArgs[i];
            console.log("parsing: ", arg);
            if (stringStartsWith(arg, "host=")) {args.host = arg.substring(5);}
            else if (stringStartsWith(arg, "port=")) {args.port = arg.substring(5);}
            else if (stringStartsWith(arg, "seleniumserverjar=")) {args.seleniumServerJar = arg.substring(18);}
            else if (stringStartsWith(arg, "seleniumaddress=")) {args.seleniumAddress = arg.substring(15);}
        }
        console.log("args: ", args);
        return args;
    }

    function stringStartsWith(str, val) {
        if ( str.length < val.length) {
            return false;
        }
        return str.slice(0,val.length).toLowerCase() === val.toLowerCase();
    }
};