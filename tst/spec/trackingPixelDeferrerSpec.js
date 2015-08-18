/*eslint-env jasmine, jquery*//*eslint strict:0, global-strict:0*//*global trackingPixelDeferrer*/
"use strict"
describe("Adding a pixel with an unsupported HTML tag type", function () {
  it('should toss an error for "canvas"', function () {
    //if we weren't testing IE8 we could just pass trackingPixelDeferrer.add.bind(...) to expect
    expect(function () {
      trackingPixelDeferrer.add("http://flap.goob/durf.jz", "canvas")
    }).toThrow("Bad htmlTagType: canvas")
  })
  it('should toss an error for " "', function () {
    //if we weren't testing IE8 we could just pass trackingPixelDeferrer.add.bind(...) to expect
    expect(function () {
      trackingPixelDeferrer.add("http://flap.goob/durf.jz", " ")
    }).toThrow("Bad htmlTagType:  ")
  })
  it('should toss an error for "p"', function () {
    //if we weren't testing IE8 we could just pass trackingPixelDeferrer.add.bind(...) to expect
    expect(function () {
      trackingPixelDeferrer.add("http://flap.goob/durf.jz", "p")
    }).toThrow("Bad htmlTagType: p")
  })
})
if (window.testExposure) {
  describe("Production mode", function () {
    xit("should be tested minified too!")
    xit("cd trackingPixelDeferrer/tst/builds && ./mink trackingPixelDeferrer.xml")
  })
  window.testExposure.firePixelsEndHooks.auto = function () {
    if (window.testExposure.firePixelsEndHooks.auto.done) window.testExposure.firePixelsEndHooks.auto.done()
  }
  window.testExposure.firePixelsEndHooks.img = function () {
    if (window.testExposure.firePixelsEndHooks.img.done) window.testExposure.firePixelsEndHooks.img.done()
  }
  ;(function (pixelQueue, TrackingPixelData) {
    var numberOfTimesAddWasCalledInitially = window.testExposure.numberOfTimesAddWasCalled
    var pixelQueueInitialLength = window.testExposure.pixelQueue.length
    var pixelQueueLengthAfterOneAdd
    var pixelQueueLengthAfterTwoAdds
    var typeOfTestResourceFooAtWindowLoadEvent
    var lengthOfPixelQueueAtWindowLoadEvent
    var redundantScript
    var pixelQueueLengthAfterRedundantScript

    trackingPixelDeferrer.add("/tst/resources/tiny-goomba.png", "img")
    pixelQueueLengthAfterOneAdd = pixelQueue.length
    trackingPixelDeferrer.add("/tst/resources/foo.js", "script")
    pixelQueueLengthAfterTwoAdds = pixelQueue.length
    trackingPixelDeferrer.add("/tst/resources/iframe.html", "iframe")
    redundantScript = document.createElement("script")
    redundantScript.src = "/src/js/trackingPixelDeferrer.js"
    document.getElementsByTagName("head")[0].appendChild(redundantScript)
    pixelQueueLengthAfterRedundantScript = pixelQueue.length
    describe("Initial state of trackingPixelDeferrer", function () {
      it("should not have had its .add function called yet in this test", function () {
        expect(numberOfTimesAddWasCalledInitially).toBe(0)
      })
      it("should start without any pixels in the queue", function () {
        expect(pixelQueueInitialLength).toBe(0)
      })
      it(".add should add one pixel at a time", function () {
        expect(pixelQueueLengthAfterOneAdd).toBe(1)
        expect(pixelQueueLengthAfterTwoAdds).toBe(2)
      })
      it("should not blank out the pixel queue if the deferrer is included more than once", function () {
        expect(pixelQueueLengthAfterRedundantScript).not.toBe(0)
      })
    })
    describe("TrackingPixelData", function () {
      var url = "http://foo.bar.baz/bom.asp"
      var minimalData = new TrackingPixelData(url)
      var callbackData = new TrackingPixelData(jQuery.noop)

      it("defaults to image HTML tags when none provided", function () {
        expect(minimalData.htmlTagType).toBe("img")
      })
      it("keeps the url unchanged", function () {
        expect(minimalData.url).toBe(url)
      })
      it("has no callback when none provided", function () {
        expect(typeof minimalData.callback).toBe("undefined")
      })
      it("has only a callback when only a callback is provided", function () {
        expect(callbackData.callback).toBe(jQuery.noop)
        expect(typeof callbackData.url).toBe("undefined")
        expect(typeof callbackData.htmlTagType).toBe("undefined")
      })
    })
    describe("Pixel firing", function () {
      it("should happen automatically without calling .fire", function (done) {
        expect(window.testExposure.numberOfTimesAddWasCalled).toBe(3)
        function verify() {
          expect(window.testExposure.numberOfTimesAddWasCalled).toBe(3)
          expect(window.testResourceFoo).toBe(true)
          done()
        }
        window.testExposure.firePixelsEndHooks.auto.done = verify
      })
    })

    jQuery(function () {
      var typeOfTestResourceFooAtDocumentReadyEvent
      var lengthOfPixelQueueAtDocumentReadyEvent

      typeOfTestResourceFooAtDocumentReadyEvent = typeof window.testResourceFoo
      lengthOfPixelQueueAtDocumentReadyEvent = pixelQueue.length
      describe("trackingPixelDeferrer at document ready event", function () {
        it("does not fire pixels on DOMContentLoaded", function () {
          expect(typeOfTestResourceFooAtDocumentReadyEvent).toBe("undefined")
          expect(lengthOfPixelQueueAtDocumentReadyEvent).not.toBe(0)
        })
      })
      describe("internal variables based on the document should be present after attempting to fire pixels", function () {
        trackingPixelDeferrer.fire()
        it("should have a reference to an HTML head tag", function () {
          if (typeof HTMLElement === "undefined") {
            expect(window.testExposure.htmlHeadTag instanceof Element).toBe(true)
          } else {
            expect(window.testExposure.htmlHeadTag instanceof HTMLElement).toBe(true)
          }
        })
        it("should have a reference to an HTML body tag", function () {
          if (typeof HTMLElement === "undefined") {
            expect(window.testExposure.htmlBodyTag instanceof Element).toBe(true)
          } else {
            expect(window.testExposure.htmlBodyTag instanceof HTMLElement).toBe(true)
          }
        })
        it("should not have actually rendered any pixels after manually calling .fire", function () {
          expect(pixelQueue.length).not.toBe(0)
        })
      })
    })

    jQuery(window).load(function () {
      typeOfTestResourceFooAtWindowLoadEvent = typeof window.testResourceFoo
      lengthOfPixelQueueAtWindowLoadEvent = pixelQueue.length
    })

    describe("trackingPixelDeferrer at window load event", function () {
      it("has not fired pixels yet, still having them in the queue", function (done) {
        function verify() {
          expect(typeOfTestResourceFooAtWindowLoadEvent).toBe("undefined")
          expect(lengthOfPixelQueueAtWindowLoadEvent).not.toBe(0)
          done()
        }
        if (document.readyState === "complete") {
          verify()
        } else {
          jQuery(window).load(function () {
            setTimeout(verify, 4)
          })
        }
      })
    })
    describe("Image pixels", function () {
      it("should not affect page layout", function (done) {
        function verify() {
          setTimeout(function () {
            var goombaImage = jQuery("img[src='/tst/resources/tiny-goomba.png']")

            expect(goombaImage.length).toBe(1)
            expect(goombaImage.css("display")).toBe("none")
            done()
          }, 250)
        }
        if (document.readyState === "complete") {
          verify()
        } else {
          jQuery(window).load(verify)
        }
      })
    })
    describe("Iframe pixels", function () {
      it("should not affect page layout", function (done) {
        function verify() {
          setTimeout(function () {
            var iframe = jQuery("iframe")

            expect(iframe.length).toBe(1)
            expect(iframe.css("display")).toBe("none")
            expect(iframe[0].contentWindow.testResourceIframeFoo).toBe(true)
            done()
          }, 250)
        }
        if (document.readyState === "complete") {
          verify()
        } else {
          jQuery(window).load(verify)
        }
      })
    })
  })(window.testExposure.pixelQueue, window.testExposure.TrackingPixelData)
} else {
  //production mode!
  trackingPixelDeferrer.add("/tst/resources/tiny-goomba.png")
  trackingPixelDeferrer.add("/tst/resources/foo.js", "script")
  trackingPixelDeferrer.add("/tst/resources/iframe.html", "iframe")
  trackingPixelDeferrer.add(function () {
    window.callbackPixelRanFlag = true
  })
  ;(function () {
    var typeOfTestResourceFooAtDocumentReadyEvent
    var typeOfTestResourceFooAfterPrematureFire
    var typeOfCallbackPixelRanFlagAtDocumentReadyEvent
    var typeOfCallbackPixelRanFlagAfterPrematureFire
    var typeOfTestResourceFooAtWindowLoadEvent
    var typeOfCallbackPixelRanFlagAtWindowLoadEvent
    var goombaImageAtDocumentReadyEvent
    var goombaImageAfterPrematureFire
    var goombaImageAtWindowLoadEvent
    var iframeAtDocumentReadyEvent
    var iframeAfterPrematureFire
    var iframeAtWindowLoadEvent

    jQuery(function () {
      typeOfTestResourceFooAtDocumentReadyEvent = typeof window.testResourceFoo
      typeOfCallbackPixelRanFlagAtDocumentReadyEvent = typeof window.callbackPixelRanFlag
      goombaImageAtDocumentReadyEvent = jQuery("img[src='/tst/resources/tiny-goomba.png']")
      iframeAtDocumentReadyEvent = jQuery("iframe")
      trackingPixelDeferrer.fire()
      typeOfTestResourceFooAfterPrematureFire = typeof window.testResourceFoo
      typeOfCallbackPixelRanFlagAfterPrematureFire = typeof window.callbackPixelRanFlag
      goombaImageAfterPrematureFire = jQuery("img[src='/tst/resources/tiny-goomba.png']")
      iframeAfterPrematureFire = jQuery("iframe")
    })
    jQuery(window).load(function () {
      typeOfTestResourceFooAtWindowLoadEvent = typeof window.testResourceFoo
      typeOfCallbackPixelRanFlagAtWindowLoadEvent = typeof window.callbackPixelRanFlag
      goombaImageAtWindowLoadEvent = jQuery("img[src='/tst/resources/tiny-goomba.png']")
      iframeAtWindowLoadEvent = jQuery("iframe")
    })
    describe("DOM content loaded event", function () {
      it("should not see any pixels loaded yet", function () {
        expect(typeOfTestResourceFooAtDocumentReadyEvent).toBe("undefined")
        expect(typeOfCallbackPixelRanFlagAtDocumentReadyEvent).toBe("undefined")
        expect(goombaImageAtDocumentReadyEvent.length).toBe(0)
        expect(iframeAtDocumentReadyEvent.length).toBe(0)
      })
    })
    describe("Attempting to fire pixels before document is complete", function () {
      it("should not have an effect", function () {
        expect(typeOfTestResourceFooAfterPrematureFire).toBe("undefined")
        expect(typeOfCallbackPixelRanFlagAfterPrematureFire).toBe("undefined")
        expect(goombaImageAfterPrematureFire.length).toBe(0)
        expect(iframeAfterPrematureFire.length).toBe(0)
      })
    })
    describe("Window loaded event", function () {
      it("should not see any pixels loaded yet", function (done) {
        jQuery(window).load(function () {
          setTimeout(function () {
            expect(typeOfTestResourceFooAtWindowLoadEvent).toBe("undefined")
            expect(typeOfCallbackPixelRanFlagAtWindowLoadEvent).toBe("undefined")
            expect(goombaImageAtWindowLoadEvent.length).toBe(0)
            expect(iframeAtWindowLoadEvent.length).toBe(0)
            done()
          }, 4)
        })
      })
    })
  })()
  describe("trackingPixelDeferrer", function () {
    it("should load pixels automatically without calling .fire", function (done) {
      setTimeout(function () {
        var goombaImage = jQuery("img[src='/tst/resources/tiny-goomba.png']")
        var iframe = jQuery("iframe")

        expect(window.testResourceFoo).toBe(true)
        expect(window.callbackPixelRanFlag).toBe(true)
        expect(goombaImage.length).toBe(1)
        expect(goombaImage.css("display")).toBe("none")
        expect(iframe.length).toBe(1)
        expect(iframe.css("display")).toBe("none")
        expect(iframe[0].contentWindow.testResourceIframeFoo).toBe(true)
        done()
      }, 333)
    })
  })
  describe("Adding a pixel after the window has been loaded", function () {
    it("should render pixel only after .fire() is called", function (done) {
      function addPixel() {
        trackingPixelDeferrer.add("/tst/resources/mario.gif")
      }
      function verifyImage(there) {
        var marioImage = jQuery("img[src='/tst/resources/mario.gif']")

        expect(marioImage.length).toBe(there ? 1 : 0)
      }
      function verifyAddVerify() {
        verifyImage(false)
        addPixel()
        verifyImage(false)
        trackingPixelDeferrer.fire()
        verifyImage(true)
        done()
      }
      if (document.readyState === "complete") {
        verifyAddVerify()
      } else {
        jQuery(window).load(function () {
          setTimeout(verifyAddVerify, 275)
        })
      }
    })
  })
  describe("Development mode", function () {
    xit("should be tested un-minified too!")
    xit("cd trackingPixelDeferrer/tst/builds && ./mink -d trackingPixelDeferrer.xml")
  })
}
