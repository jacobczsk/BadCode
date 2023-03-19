# BadCode
 Tools to make your code unreadable
## number.ts
Convert number to its unreadable form in JavaScript
```javascript 
420 === (! + [] + ! + []) * (! + [] + ! + []) * (! + [] + ! + [] + ! + []) * (! + [] + ! + [] + ! + [] + ! + [] + ! + []) * (! + [] + ! + [] + ! + [] + ! + [] + ! + [] + ! + [] + ! + []) // true
```
### Args
```
Usage: node <script> [NUMBER] [VAR NAMES] [OPTIONS]
Output: JS code, that puts NUMBER into var "num", but without any base10 digit 
Options:
NUMBER - an integer to be processed
VAR NAMES - how to name the variables (e.g. "BADCODE" => variables "B", "A", ...)
Arguments:
-h, --help              Display this message and exit
-l, --console-log       Add "console.log(num);" at the end of the file
-n, --no-vars           Don't use variables, write a inline expression instead
```
## messyvar.ts
Rename variables to random strings.  
Eg.
```javascript
var x = 123;
console.log(x);
```
is converted to
```javascript
var cJXTLBpkURNjamIvRqXO = 123;
console.log(cJXTLBpkURNjamIvRqXO);
```
### Args
```
node <script> [FILENAME]
```
The unreadable code is automatically written to `path/filename.ur.js`.