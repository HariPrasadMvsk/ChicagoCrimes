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
const csvData = fs.createReadStream('../../../chicago-crimes-old/chicagocrimes.csv');
// htop is for check memory usage
const rl = readline.createInterface({
	input: csvData
});
let isHeader = true;
let header = [];
let year, primaryType, arrest;
let finalData = {};
rl.on('line', (line) => {
	if(isHeader) {
		isHeader = false;
		header = line.split(',');
		year = header.indexOf('Year');
		primaryType = header.indexOf('Primary Type');
		arrest = header.indexOf('Arrest');
		//console.log(header);
	} else {
		const row = line.split(',');
		
		// filteration.
		let obj = {};
		if(row[primaryType] === 'ASSAULT' && (row[year] >= 2001 && row[year] <= 2018) ) {
			//console.log('promary type: '+row[primaryType]);
			if(row[arrest] == 'TRUE') {
				//console.log('arrest true:'+row[arrest]);
				if(finalData[row[year]]){
					finalData[row[year]]['ArrestTrue']++
				} else {
					obj['ArrestTrue'] = 1;
					obj['ArrestFalse'] = 0;
					finalData[row[year]] = obj;
				}
				
			} else if(row[arrest] == 'FALSE') {
				//console.log('arrest false:'+row[arrest]);
				if(finalData[row[year]]){
					finalData[row[year]]['ArrestFalse']++
				} else {
					obj['ArrestTrue'] = 0;
					obj['ArrestFalse'] = 1;
					finalData[row[year]] = obj;
				}
			}
		}
	}
	
	//console.log(finalData);
	//rl.pause();
});

rl.on('close', () => {
	fs.writeFile('./output/data.json', JSON.stringify(finalData), (err) => {
		if(err) {
			console.log('Err::', err);
		}
		console.log('File has been written!');
		console.timeEnd('Data munging');
		//jsonlint.com
	});
});
