#!/bin/bash


IMAGE1="julius-camenzind-snowmountainenviro.jpg"

printf '\033]1337;File=inline=1;width=100%%;preserveAspectRatio=1'
printf ":"
base64 < "$IMAGE1"
printf '\a\n'


IMAGE2="adventuring_party_by_westlylafleur-db7fpya.jpg"

printf '\033]1337;File=inline=1;width=100%%;preserveAspectRatio=1'
printf ":"
base64 < "$IMAGE2"
printf '\a\n'

