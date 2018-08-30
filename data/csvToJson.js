//PART-1 (Data Munging)
//1. Read the fileCreatedDate
//2. Break down the csv line by line
//3. Extract the header row
//4. Filter and aggregate the data and store the data
//5. Convert the data into JSON
//6. Write the json back to a file

//Part-2 (Data Visualization) (using d3.js)
console.time('data munging');
const fs = require('fs');
const readline = require('readline');

// goto nodejs.org -> 1. file system, 
const csvData = fs.createReadStream('./input/chicagocrimes.csv');
// htop is for check memory usage
const rl = readline.createInterface({
	input: csvData
});
let isHeader = true;
let header = [];
let year, primaryType, description;
let finalData = {};
rl.on('line', (line) => {
	if(isHeader) {
		isHeader = false;
		header = line.split(',');
		year = header.indexOf('Year');
		primaryType = header.indexOf('Primary Type');
		description = header.indexOf('Description');
		//console.log(header);
	} else {
		const row = line.split(',');
		
		// filteration.
		let obj = {};
		if(row[primaryType] === 'THEFT' && (row[year] >= 2001 && row[year] <= 2018) ) {
			if(row[description] === 'Over $500') {
				if(finalData[row[year]]){
					finalData[row[year]]['theftOver500']++
				} else {
					obj['theftOver500'] = 1;
					obj['theftUnder500'] = 0;
					finalData[row[year]] = obj;
				}
				
			} else if(row[description] === '$500 AND UNDER') {
				if(finalData[row[year]]){
					finalData[row[year]]['theftUnder500']++
				} else {
					obj['theftOver500'] = 0;
					obj['theftUnder500'] = 1;
					finalData[row[year]] = obj;
				}
			}
		}
	}
	
	//console.log(finalData);
	//rl.pause();
});

// rl.on

rl.on('close', () => {
	fs.writeFile('./output/theft.json', JSON.stringify(finalData), (err) => {
		if(err) {
			console.log('Err::', err);
		}
		console.log('File has been written!');
		console.timeEnd('Data munging');
		//jsonlint.com
	});
});

//sketchboard
/*
{
	"2001": {
		"theftOver500": 3000,
		"theftUnder500": 2000
	}
}
*/