/**
 * A browser Window object. Aliased as <code>global</code>
 * @external window
 */

/**
 * An HTML Document object. Aliased as <code>doc</code>
 * @external document
 */
;(function (global, doc) {
  "use strict"
  var globalTrackingPixelDeferrerNamespaceEntry = "trackingPixelDeferrer" //because we're using closure-advanced compilation
  var fire = "fire" //again because of closure-advanced
  var eventAttacher = global.attachEvent
  var eventListener = global.addEventListener
  var pixelQueue = []
  var htmlHeadTag
  var htmlBodyTag
  var img = "img" //just for teensy bit of compression
  var script = "script" //same as img
  var getElementsByTagName = "getElementsByTagName" //for a wee dab of compression
  var appendChild = "appendChild" //for a mote of compression
  var timeout = setTimeout //to save a five bytes
  var supportedHtmlTagTypes = img + script + "iframe" //normally would be an array, but there's no Array.prototype.indexOf in IE8

  function TrackingPixelData(urlOrCallback, htmlTagType) {
    var me = this

    htmlTagType = htmlTagType || img
    if (typeof urlOrCallback === "string") {
      me.url = urlOrCallback
      me.htmlTagType = htmlTagType
      if (htmlTagType.length < 3 || supportedHtmlTagTypes.indexOf(htmlTagType) === -1) {
        throw "Bad htmlTagType: " + htmlTagType
      }
    } else {
      me.callback = urlOrCallback
    }
  }
  function renderPixel(trackingPixelData) {
    var callback = trackingPixelData.callback
    var htmlTagType = trackingPixelData.htmlTagType
    var url = trackingPixelData.url
    var htmlElement

    if (callback) {
      callback()
    } else {
      htmlElement = doc.createElement(htmlTagType)
      htmlElement.src = url
      if (htmlTagType === script) {
        htmlHeadTag[appendChild](htmlElement)
      } else {
        htmlElement.style.display = "none"
        htmlBodyTag[appendChild](htmlElement)
      }
    }
  }
  function firePixels() {
    var queueIndex = 0
    var queueLength = pixelQueue.length
    var hook //MINK-DELETE

    if (!htmlHeadTag) htmlHeadTag = doc[getElementsByTagName]("head")[0]
    if (!htmlBodyTag) htmlBodyTag = doc[getElementsByTagName]("body")[0]
    //MINK-DELETE-START
    global.testExposure.htmlHeadTag = htmlHeadTag
    global.testExposure.htmlBodyTag = htmlBodyTag
    //MINK-DELETE-END
    if (doc.readyState === "complete") {
      while (queueIndex < queueLength) {
        renderPixel( pixelQueue[queueIndex] )
        queueIndex++
      }
      pixelQueue = []
      //MINK-DELETE-START
      if (global.testExposure.firePixelsEndHooks) {
        for (hook in global.testExposure.firePixelsEndHooks) {
          if (global.testExposure.firePixelsEndHooks.hasOwnProperty(hook)) {
            timeout(global.testExposure.firePixelsEndHooks[hook], 250)
          }
        }
      }
      //MINK-DELETE-END
    }
  }

  //guard against multiple scripts including this,
  //and wiping out whatever's in the first one's pixelQueue
  if (global[globalTrackingPixelDeferrerNamespaceEntry]) return

  /**
   * <p>An object that queues up tracking pixels to be fired in a way that does affect page performance timings.</p>
   * <p>You really should only ever need to use its .add method</p>
   * @example
   * <caption>Your page needs to fire a pixel to tracker.com
   * </caption>
   * trackingPixelDeferrer.add("http://tracker.com/trackme?userdata=1234567890")
   * @namespace trackingPixelDeferrer
   * @global
   */
  global[globalTrackingPixelDeferrerNamespaceEntry] = {
    /**
     * Add a pixel to the queue to be automatically rendered to the page later.
     * @memberOf trackingPixelDeferrer
     * @name add
     * @function
     * @param {(Function|String)} urlOrCallback Either a URL to the tracking pixel, or a callback to be fired.
     * @param {String} [htmlTagType="img"] The type of html tag that will be rendered. Possible values include: "script", "iframe", "img".
     */
    add: function (urlOrCallback, htmlTagType) {
      pixelQueue.push( new TrackingPixelData(urlOrCallback, htmlTagType) )
      global.testExposure.numberOfTimesAddWasCalled++ //MINK-DELETE
    }
  }
  /**
   * Automatically called after the window loaded event.
   * This allows you to fire the pixels manually if the page is already completely loaded.
   * @memberOf trackingPixelDeferrer
   * @name fire
   * @function
   */
  global[globalTrackingPixelDeferrerNamespaceEntry][fire] = firePixels
  function windowOnLoadCallback() {
    timeout(firePixels, 4)
  }

  if (eventListener) {
    eventListener("load", windowOnLoadCallback)
  } else if (eventAttacher) {
    eventAttacher("onload", windowOnLoadCallback)
  } else {
    timeout(firePixels, 5000)
  }

  //MINK-DELETE-START
  global.testExposure = {
    pixelQueue: pixelQueue,
    TrackingPixelData: TrackingPixelData,
    renderPixel: renderPixel,
    numberOfTimesAddWasCalled: 0,
    firePixelsEndHooks: {}
  }
  //MINK-DELETE-END

})(window, document)
