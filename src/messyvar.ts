import { readFileSync, writeFileSync } from 'fs';
import { parse, dirname, join } from 'path';

const START: string[] = ["var", "const", "let", ",", ";"];
const SEP: string[] = [" ", "(", ")", ";", ":", "=", "[", "]", "{", "}", ",", "!", "++", "--"];
const STRING: string[] = ['"', "'"];
const WS: string[] = ["\n", "\t", "\r"];
const NL: string[] = ["\n", "\r"];

const FILE: string = (process.argv[2] === undefined) ? process.cwd() : process.argv[2];

var data: string = readFileSync(FILE, { encoding: 'utf8' });

const varName = (length: number) => {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.random() * chars.length);
    }
    return result;
}

var tokens: string[] = [];
var token: string = "";
var inString: boolean = false;
for (const char of data) {
    if (WS.indexOf(char) === -1) {
        if (STRING.indexOf(char) !== -1) {
            token += char;
            if (inString) {
                if (token !== "") {
                    tokens.push(token);
                    token = "";
                }
            }
            inString = !inString;
        } else if (SEP.indexOf(char) !== -1 && !inString) {
            if (token !== "") {
                tokens.push(token);
                token = "";
            }
        } else {
            token += char;
        }
    } else if (NL.indexOf(char) !== -1) {
        if (token !== "") {
            tokens.push(token);
            token = "";
        }
    }
}
if (token !== "") {
    tokens.push(token);
}

var names: string[] = [];
var started: boolean = false;
tokens.forEach(token => {
    if (started) {
        var valid: boolean = true;
        STRING.forEach(element => {
            valid = (!valid || token.startsWith(element));
        });
        if (valid) names.push(token);
        started = false;
    } else if (START.indexOf(token) !== -1) {
        started = true;
    }
});

const newNames: Map<string, string> = new Map<string, string>();

names.forEach(element => {
    newNames.set(element, varName(20));
});

var code: string = ``;

token = "";
inString = false;
for (const char of data) {
    if (WS.indexOf(char) === -1) {
        if (STRING.indexOf(char) !== -1) {
            token += char;
            if (inString) {
                if (token !== "") {
                    if (newNames.has(token)) {
                        code += newNames.get(token);
                    } else if (newNames.has(token.split(".")[0])) {
                        var parts: string[] = token.split(".");
                        var newName: string | undefined = newNames.get(parts[0]);
                        if (newName !== undefined) {
                            parts[0] = newName;
                            code += parts.join(".");
                        }
                    } else {
                        code += token;
                    }
                    token = "";
                }
            }
            inString = !inString;
        } else if (SEP.indexOf(char) !== -1 && !inString) {
            if (token !== "") {
                if (newNames.has(token)) {
                    code += newNames.get(token);
                } else if (newNames.has(token.split(".")[0])) {
                    var parts: string[] = token.split(".");
                    var newName: string | undefined = newNames.get(parts[0]);
                    if (newName !== undefined) {
                        parts[0] = newName;
                        code += parts.join(".");
                    }
                } else {
                    code += token;
                }
                token = "";
            }
            code += char;
        } else {
            token += char;
        }
    } else if (NL.indexOf(char) !== -1) {
        if (token !== "") {
            if (newNames.has(token)) {
                code += newNames.get(token);
            } else if (newNames.has(token.split(".")[0])) {
                var parts: string[] = token.split(".");
                var newName: string | undefined = newNames.get(parts[0]);
                if (newName !== undefined) {
                    parts[0] = newName;
                    code += parts.join(".");
                }
            } else {
                code += token;
            }
            token = "";
        }
        code += char;
    }
}

const FILENAME: string = parse(FILE).name + ".ur" + parse(FILE).ext;

writeFileSync(join(dirname(FILE), FILENAME), code, { encoding: 'utf8' })