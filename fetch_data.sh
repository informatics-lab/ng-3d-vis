#!/bin/sh
remote="http://ec2-52-16-246-202.eu-west-1.compute.amazonaws.com:9000/molab-3dwx-ds/"
metadata_file="media/55896829e4b0b14cba17273c"
video_file="media/55896829e4b0b14cba17273c/data"

mkdir "cache"
curl ${remote}${metadata_file} > "cache/ec2_index"
curl ${remote}${video_file} > "cache/ec2_data"
