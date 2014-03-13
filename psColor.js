(function (global) {
    'use strict';

    var ps = global.ps = global.ps || {};
    ps.color = {};

    ps.color.getImageAverageColor = function (imageElement, options) {
        if (!imageElement) {
            return false;
        }

        options = options || {};
        var settings = {
            tooDark: (options.tooDark || 0.03) * 255 * 3, // How dark is too dark for a pixel
            tooLight: (options.tooLight || 0.97) * 255 * 3, // How light is too light for a pixel
            tooAlpha: (options.tooAlpha || 0.1) * 255 // How transparent is too transparent for a pixel
        };

        var w = imageElement.width, h = imageElement.height;

        // Setup canvas and draw image onto it
        var context = document.createElement('canvas').getContext('2d');
        context.drawImage(imageElement, 0, 0, w, h);

        // Extract the rgba data for the image from the canvas
        var subpixels = context.getImageData(0, 0, w, h).data;

        var pixels = {
            r: 0, g: 0, b: 0, a: 0
        };
        var processedPixels = 0;

        var pixel = {
            r: 0, g: 0, b: 0, a: 0
        };
        var luma = 0; // Having luma in the pixel object caused ~10% performance penalty for some reason

        // Loop through the rgba data
        for (var i = 0, l = w * h * 4; i < l; i += 4) {
            pixel.r = subpixels[i];
            pixel.g = subpixels[i + 1];
            pixel.b = subpixels[i + 2];
            pixel.a = subpixels[i + 4];

            // Only consider pixels that aren't black, white, or too transparent
            if (pixel.a > settings.tooAlpha &&
                (luma = (pixel.r + pixel.g + pixel.b)) > settings.tooDark && // Luma is assigned inside the conditional to avoid re-calculation when alpha is not met
                luma < settings.tooLight) {

                pixels.r += pixel.r;
                pixels.g += pixel.g;
                pixels.b += pixel.b;
                pixels.a += pixel.a;

                processedPixels++;
            }
        }

        // Values of the channels that make up the average color
        var channels = {
            r: null,
            g: null,
            b: null,
            a: null
        };

        if (processedPixels > 0) {
            channels = {
                r: Math.round(pixels.r / processedPixels),
                g: Math.round(pixels.g / processedPixels),
                b: Math.round(pixels.b / processedPixels),
                a: Math.round(pixels.a / processedPixels)
            };
        }

        var o = {
            channels: channels,
            toStringRgb: function () {
                // Returns a CSS compatible RGB string (e.g. '255, 255, 255')
                var c = this.channels;
                return [c.r, c.g, c.b].join(', ');
            },
            toStringRgba: function () {
                // Returns a CSS compatible RGBA string (e.g. '255, 255, 255, 1.0')
                var c = this.channels;
                return [c.r, c.g, c.b, c.a].join(', ');
            },
            toStringHex: function () {
                // Returns a CSS compatible HEX coloor string (e.g. 'FFA900')
                var toHex = function (d) {
                    h = Math.round(d).toString(16);

                    if (h.length < 2) {
                        h = '0' + h;
                    }
                    return h;
                };

                var c = this.channels;
                return [toHex(c.r), toHex(c.g), toHex(c.b)].join('');
            }
        };

        return o;
    };
})(this);