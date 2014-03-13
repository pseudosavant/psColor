psColor.js
==========

psColor.js is a small JavaScript library for calculating the average color of an
`<img>` element in the browser.

Usage
-----

1. Place `<script src='psColor.js'></script>` into your web page before your
script(s) that will use psColor.js.
2. Call `ps.color.getImageAverageColor(imageElement)` where imageElement is an 
`<img>` that has completed loading, and is on the same domain as the web page.
3. `ps.color.getImageAverageColor` will return an object with three methods that
will give you the average color in `rgb`, `rgba`, and hex:
    1. toStringRgb (e.g. `255,128,0`)
    2. toStringRgba  (e.g. `255,128,0,0.5`)
    3. toStringHex (e.g. `FF8000`)

Same Origin Security Policy
---------------------------
Images are placed into a `<canvas>` to calculate the color. Images from a
different domain can't be processed in a `<canvas>` due to same origin security
policies.
