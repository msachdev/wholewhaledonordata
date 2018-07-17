# wholewhaledonordata

A (very unfinished) client-server database written in node.js. This is the start of an implementation of the whole whale developer test project. Modules used: express, hogan, consolidate, anydb, http, csv-parse, fs, path. I attempted to use DynamoDB but struggled for a while getting the license key authorization to work, so I used sqlite3. Commented out AWS code is in the server file.

Known bugs:
Mostly that it is incomplete! Basically couldn't get to data handling on client side and populating the table with that data. 
