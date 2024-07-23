# Image Processor

## Description
A system that processes image data from CSV files by validating, processing, storing, and providing a unique request ID to the user.

## Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file and add the

## API'S Details
## Webhook Add - CURL
curl --location 'https://image-processor-bxtc.onrender.com/api/webhook/add' \
--header 'Content-Type: application/json' \
--data '{
    "url": "https://b0ba50d290880c4617aeb7bcfd29eea1.m.pipedream.net"
}'

## Webhook Delete - cUrl
curl --location --request DELETE 'https://image-processor-bxtc.onrender.com/api/webhook/delete/669ff781327ab22002ac827b' \
--header 'Content-Type: application/json' \
--data ''

## Sheet Upload CURL
curl -X POST https://image-processor-bxtc.onrender.com/api/sheet/upload \
     -F "csv-file=@/path/to/your/file.csv"


## Sheet Status CURL
curl -X GET https://image-processor-bxtc.onrender.com/api/sheet/status/<requestId>

## Whole Sheet Json CURL
curl -X GET https://image-processor-bxtc.onrender.com/api/sheet/<sheetId>

## Download Sheet CuRL
curl -X GET https://image-processor-bxtc.onrender.com/api/sheet/download/<sheetId>




