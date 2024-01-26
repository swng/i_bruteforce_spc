const {make_sys_call} = require('./make_sys_call.js');
const fs = require('fs');
const readline = require('readline');

async function pc_chance_filter(fumen) {
    let command = `java -jar sfinder.jar percent -K +t -d 180 -p '*!' -t '${fumen}' -c 6`

    let results_string = await make_sys_call(command);
    let results_list = results_string.split("\n");
    for (line of results_list) {
        if (line.includes("success")) {
            line = line.replaceAll(',', '.');
            const percentageRegex = /(\d+\.\d+)%/;
            const match = line.match(percentageRegex);
            if (match && match[1]) {
                const percentageValue = parseFloat(match[1]);
                console.log(percentageValue)
                if (percentageValue >= 98.0) {
                    return percentageValue;
                }
                return 0.0;
              }
        }
    }
    return 0.0;
}

async function main() {
    const inputStream = fs.createReadStream("./step_f_3.txt", 'utf8');

    // Create a readable stream for reading lines
    const rl = readline.createInterface({
        input: inputStream,
        crlfDelay: Infinity
    });

    // Create a writable stream for the output file
    const outputStream = fs.createWriteStream("step_g.txt");


    let lineCount = 0;

    // Process each line asynchronously using for...of loop
    (async () => {
        for await (const line of rl) {
            lineCount++;
            if (lineCount >= 117324) {
                console.log(`Line ${lineCount}`);

                split_line = line.trim().split(",");
                let process_pc_chance = await pc_chance_filter(split_line[0]);
    
                if (process_pc_chance >= 98.0) {
                    // If the condition is true, write the line to the output file
                    outputStream.write(`${process_pc_chance},${line}\n`);
                }
            }
            
        }

        // Close the writable stream for the output file
        outputStream.end();
        console.log('Processing completed.');
    })();
    
}

main();