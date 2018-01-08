#!/bin/bash


IMAGE="simple-decorative-lines-divider-by-Vexels.png"

printf '\033]1337;File=inline=1;width=100%%;height=1;preserveAspectRatio=1'
printf ":"
base64 < "$IMAGE"
printf '\abar\nbaz'


printf 'foo\033]1337;File=inline=1;height=1;preserveAspectRatio=1'
printf ":"
base64 < "$IMAGE"
printf '\abar\nbaz'

printf 'foo\033]1337;File=inline=1;height=2;preserveAspectRatio=1'
printf ":"
base64 < "$IMAGE"
printf '\abar\nbaz'
