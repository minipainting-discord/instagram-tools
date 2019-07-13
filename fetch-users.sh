#!/bin/sh

if [ "$GOOGLE_SHEETS_API_KEY" = "" ]; then
  echo "Needs an API key"
  exit 1
fi

SHEET_ID=1_SX1PynC9whLMLWKYD1u1IWhM_5lt3vde5N4xOV8nJc
SHEET_URL="https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A2:D?key=${GOOGLE_SHEETS_API_KEY}" 

http "$SHEET_URL" |
  jq '.values | map({discordName: .[0], igUrl: .[3]}) | map(select(.igUrl != null))' > users.json
