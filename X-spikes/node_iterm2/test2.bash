#!/bin/bash


LOGO="logo.png"
DIVIDER="simple-decorative-lines-divider-by-Vexels.png"




printf 'foo\033]1337;File=inline=1;height=3;preserveAspectRatio=1'
printf ":"
base64 < "$LOGO"
printf '\a v1.3 https://www.foo\n'

printf 'foo\033]1337;File=inline=1;height=2;preserveAspectRatio=1'
printf ":"
base64 < "$DIVIDER"
printf '\abar\nbaz'
