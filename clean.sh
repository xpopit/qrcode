#!/bin/bash

# Create opencv directory in public
mkdir -p public/opencv

# Download OpenCV.js files
curl -o public/opencv/opencv.js https://docs.opencv.org/4.8.0/opencv.js
curl -o public/opencv/opencv_js.wasm https://docs.opencv.org/4.8.0/opencv_js.wasm

# Find and remove .js files that have corresponding .jsx files
for jsfile in src/*.js; do
    if [ -f "${jsfile%.*}.jsx" ]; then
        echo "Removing $jsfile (keeping ${jsfile%.*}.jsx)"
        rm "$jsfile"
    fi
done

# Remove specific .js files
rm -f src/App.js
rm -f src/index.js 