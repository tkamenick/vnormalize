# vnormalize

This is a simple application that was a reason to learn node.js. It uses ffmpeg to reencode the audio track of a video to aac so that the video can be played on an iOS device via VLC or another video player app. It also downloads subtitles and standardizes with the mkv container. It only works on OSX and requires ffmpeg and libaac-fdk to be installed.

# Usage
```
vnormalize -f video.mp4
```
