# trackingPixelDeferrer

Load tracking pixels in a way that does not degrade page performance timings.

## Description
JavaScript for HTML web pages.

Adds your pixels to a queue, then automatically renders them after the window loaded event.

## Example JavaScript

    trackingPixelDeferrer.add("http://super-tracker.biz/spy-on-user.asp?zzz=1234567890")
    trackingPixelDeferrer.add("/sneaky-seller/marketing-iframe.html", "iframe")
    trackingPixelDeferrer.add("https://googswatchyou/js/eyeballs.js", "script")
    trackingPixelDeferrer.add(function () {
        callUrlTallyer(document.location)
        invokeNiftyMarketingThingy(document.cookie)
    })

## Download
[Production](/dist/trackingPixelDeferrer.min.js)

[Source](/src/js/trackingPixelDeferrer.js)

## Requires
A browser window

An HTML document object

## Test coverage
Tested in IE 8+, FireFox, Chrome, Safari, and Opera.

Subjected to [a battery of Jasmine tests](/tst/run.jade).

## Development and Documentation
To start developing for trackingPixelDeferrer or better the documentation you need [node](http://nodejs.org/), [git](http://git-scm.com/), [gulp](http://gulpjs.com/), and [bower](http://bower.io/). Then run from the base folder:

    npm install
    bower install
    gulp --port=3001

Then to view the documentation navigate to [http://localhost:3001/doc](http://localhost:3001/doc) in your web browser. Gulp will watch for changes and regenerate the documentation. If you edit a source file, or something in the tests directory karma will try to spawn a bunch of browsers and run the tests in each of them. Watch your terminal for the results.

### on Windows

Don't use Cygwin. We recommend PowerShell instead. At the time this is written, there is a bug preventing npm from installing GitHub dependencies on Cygwin.

### Generating a Distribution

For best compression of production code and granular test integration, trackingPixelDeferrer is built with Mink. At this time there is not yet a public Mink service in operation. That may change in the future. 

Employees of GSI Commerce // eBay Enterprise have access to a Mink service. Not an employee, but still want to contribute? Make a pull request with your source changes, and I'll prepare it for production.

## History
Created for improving page performance while still providing pixel tracking.

## Author
Ethan B Martin

GSI Commerce // eBay Enterprise