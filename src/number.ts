if (process.argv.indexOf("-h") != -1 || process.argv.indexOf("--help") != -1) {
    console.log(`BadCode Number formatter 0.1-alpha2 (pre-release)
Usage: node ${process.argv[1]} [NUMBER] [VAR NAMES] [OPTIONS]
Output: JS code, that puts NUMBER into var "num", but without any base10 digit 
Options:
NUMBER - an integer to be processed
VAR NAMES - how to name the variables (e.g. "BADCODE" => variables "B", "A", ...)
Arguments:
-h, --help\t\tDisplay this message and exit
-l, --console-log\tAdd "console.log(num);" at the end of the file
-n, --no-vars\t\tDon't use variables, write a inline expression instead`)
} else {

    const LETTERS: String = (process.argv[3] === undefined || process.argv[3].startsWith("-") || !Number.isNaN(Number.parseInt(process.argv[3]))) ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : process.argv[3];

    const isPrime = (num: number) => {
        for (let i = 2; i <= num / 2; i++) {
            if (num % i === 0) return false;
        }
        return num > 1;
    }

    const factorize = (inputNum: number) => {
        var factors: Array<number> = [];
        if (isPrime(inputNum) || inputNum == 1 || inputNum == -1) {
            factors = [inputNum];
        } else {
            for (let i: number = 2; i <= inputNum / 2; i++) {
                if (inputNum % i === 0 && isPrime(i)) {
                    var x: number = 0;
                    while (true) {
                        x++;
                        if (inputNum % (i ** x) === 0) {
                            factors.push(i);
                        } else {
                            break;
                        }
                    }
                }

            }
        }
        return factors;
    }

    var code: String = `var ${LETTERS[0]} = ! + [];\n`;

    const num: number = Number.parseInt(process.argv[2]);

    if (num == 0) {
        code = `var num = [];`
    } else {

        const factors: Array<number> = factorize(Math.abs(num));
        const negative: boolean = num < 0;

        var vars: Array<number> = [];
        if (process.argv.indexOf("-n") != -1 || process.argv.indexOf("--no-vars") != -1) {
            var i: number = 0;
            code = `var num = `;
            if (negative) {
                code += `-`;
            }
            factors.forEach(element => {
                code += `(`;
                for (let x = 0; x < element; x++) {
                    code += "! + []";
                    if (!(x === element - 1)) {
                        code += ` + `;
                    }
                }
                code += `)`;
                if (i != factors.length - 1) {
                    code += ` * `;
                }
                i++;
            });
            code += `;`;

        } else {
            var i = 0;
            factors.forEach(element => {
                if (vars.indexOf(element) === -1) {
                    vars.push(element);
                    code += `var ${LETTERS[vars.indexOf(element) + 1]} = `;
                    for (let j: number = 0; j < element - 1; j++) {
                        code += `${LETTERS[0]} + `;
                    }
                    code += `${LETTERS[0]};\n`;
                    i++;
                }
            });

            code += `var num = `;
            if (negative) code += `-`;
            var left = num;
            i = 0;
            factors.forEach(element => {
                code += `${LETTERS[vars.indexOf(element) + 1]}`;
                if (!(i == factors.length - 1)) {
                    code += ` * `;
                }
                i++;
            });
            code += `;`;
        }
    }

    if (process.argv.indexOf("-l") != -1 || process.argv.indexOf("--console-log") != -1) {
        code += `\nconsole.log(num);`;
    }

    console.log(code);
}
