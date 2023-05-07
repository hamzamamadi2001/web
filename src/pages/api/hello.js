import XLSX from "xlsx";
const axios = require('axios');
import SimpleLinearRegression from 'ml-regression-simple-linear';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');


var desiredcolumn = (parseInt(req.body.index)-1)*-1;
console.log(req.body)
let url = req.body
  axios.get(req.body.url, { responseType: 'arraybuffer' })
  .then(response => {
    // Parse the file data using xlsx
    const data = new Uint8Array(response.data);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0]; // Get the name of the first sheet

console.log(sheetName);
 const worksheet = workbook.Sheets[sheetName];
const data2 = XLSX.utils.sheet_to_json(worksheet);
   let valuesArr = data2.map(obj => Object.values(obj));

  let deimension = valuesArr[0].length;
  if(deimension != 2 )
  {
    return res.status(400).json({error:1,});
  }
 let y = []
let X = []
valuesArr.forEach(element => {
  y.push(element.splice(desiredcolumn, 1))
});

console.log(valuesArr)
X = valuesArr.map(subArr => subArr[0]);

 y = y.map(subArr => subArr[0]);
//  let sum = y.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
// const ymean = sum / y.length;
// y= y.map((num) => num - ymean);
//  X = valuesArr.map(subArr => subArr[0]);
  
//   sum = X.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
// const xmean = sum / X.length;
// X = X.map((num) => num - xmean);

  

const regression = new SimpleLinearRegression(y ,X);

console.log("this is the slope",regression.slope) // 2
console.log("this is the intercept",regression.intercept ) // -1
return res.status(200).json({error:0,W:regression.slope,intercept :regression.intercept});
 
    // Perform linear regression on the Excel data
    // ...

    // Return the regression results to the client
    // ...
  })
  .catch(error => {
    console.error('Failed to download file:', error);
    return res.status(500).json({error:1});
  });

 
 
}