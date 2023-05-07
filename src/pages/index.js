import Image from 'next/image'
import { Inter } from 'next/font/google'

import {SiMicrosoftexcel } from 'react-icons/si';
import {BsFillCheckCircleFill } from 'react-icons/bs';
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })
import React, { useState } from 'react';
import axios from 'axios';
import XLSX from 'xlsx';


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [columnregression, setcolumnregression] = useState(0);
  const [x, setx] = useState([]);
  const [y, sety] = useState([]);
  const [fileUrl, seturl] = useState("");
  const [completed, setcompleted] = useState(false);
  const [predict, setpredict] = useState("");
  const [value, setvalue] = useState("");



  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [finalresult, setfinalresult] = useState(false);



  const [columnsname, setcolumnsname] = useState([]);
  const [typeofchart, settypeofchart] = useState("bar");



  const [file, setFile] = useState(null);
  const [name, setname] = useState('');
  const [firstcolumn, setfirst] = useState('');
  const [error, seterror] = useState('');
  const [existerror, setexisterror] = useState(0);
  const [secondcolumn, setsecond] = useState('');
  const [result, setresult] = useState([]);
  


 

  
  async function handleSubmit() {
  if (file==null || columnsname.length!=2){
    return
  }
    setUploading(true);
    setfinalresult(true)
    seterror('');
    setexisterror(false);
    setcompleted(false)



    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', "nakset");
    formData.append('api_key', "171741584542441");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/my_online_store/upload`,
       formData,{
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percent = Math.floor((loaded * 100) / total);
         setProgress(percent);
      },
        }
      ).then(async (response)=>{

 if (response.status === 200) {
        const imageUrl = response.data.secure_url;
        
        
        const respo = await fetch('http://localhost:3000/api/hello', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
    
          body: JSON.stringify({url:imageUrl,index:columnregression})
        });
        const res = await respo.json()
        if(res.error){

          seterror('your file is not good for univariate linear regression');
        setexisterror(true);
         seturl(imageUrl)
        setcompleted(false)

        }else{
          seterror('');
          setexisterror(false);
           seturl(imageUrl)
          setcompleted(true)
          setresult([res.W,res.intercept])
         }
        
      
    
        



        
        
      } else {
         
     
    seterror(response.statusText);
    setexisterror(true);
       }
      }) 
     
    
    } catch (error) {
      
  
    seterror(error);
    setexisterror(true);
     }
    setUploading(false);
    setfinalresult(false)



  

    
    // Handle the response from the server
  }


  const handleFileChange = (e) => {
     const selectedFile = e.target.files[0];
     if (e.target.files.length === 0) {
      console.log('File selection cancelled by user');
      return;
    }

    if (selectedFile && selectedFile.type === 'application/vnd.ms-excel' || selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(selectedFile);
      setname(selectedFile.name);
      
       
      readExcelFile(e)
       e.target.value = null;
    } else {
      alert('Please select an Excel file');
    }
  }; 


  

  function readExcelFile(e) {
    seterror('')
    setexisterror(0)
    const input = document.getElementById('file');
    const file = input.files[0];
    let isitgoodfile = true;
    
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function (event) {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      if(jsonData[0].length!=2){
        seterror("the document is clean to make linear regression")
        setexisterror(1)
        return
      }
//the code goes here
for (let index =1 ; index < jsonData.length; index++) {
      if(isitgoodfile == false)
      {
        seterror("the document is clean to make linear regression")
        setexisterror(1)
        break;
      }
      
              for (let index2 = 0; index2 < jsonData[index].length; index2++) {
                    if(typeof jsonData[index][index2] != "number" && typeof jsonData[index][index2] != "bigint")
                    {
                       isitgoodfile = false;
                      seterror("the document is clean to make linear regression")
                      setexisterror(1)
                      break;
                        
                    }
                    
              }
  
}



if(isitgoodfile == true)
      {
        seterror("")
        setexisterror(2)
      
      }
 setcolumnsname(jsonData[0])
 let res1 =separateMatrix(jsonData) 
setx(res1[0])
sety(res1[1])
       
    };
  }

  function separateMatrix(matrix) {
    let matrix1 = [];
    let matrix2 = [];
  
    for (let i = 1; i < matrix.length; i++) {
      // slice the row into two arrays
      let row1 = matrix[i].slice(0, matrix[i].length / 2)[0];
      let row2 = matrix[i].slice(matrix[i].length / 2)[0];
  
      // add the split rows to the separate matrices
      matrix1.push(row1);
      matrix2.push(row2);
    }
  
    return [matrix1, matrix2];
  }


 



  return (

    <>
     <div class=" bg-gray-100 min-w-screen">
    
    <header class="w-full text-gray-700 bg-white border-t border-gray-100 shadow-sm body-font">
        <div class="container  flex justify-center  flex-col flex-wrap items-center p-5 mx-auto md:flex-row">

             
             
                <p className='text-blue-600 font-bold '><span className='font-bold text-red-600 text-2xl'>L</span>inear regresstion calculator</p>
             
            
        </div>
    </header>
   
     
    
    
</div>



















<div class="py-16 bg-gray-50 overflow-hidden">
    <div class="container m-auto px-6 space-y-8 text-gray-500 md:px-12">
        <div>
            <span class="text-gray-600 text-lg font-semibold">how ti works</span>
            <h2 class="mt-4 text-2xl text-gray-900 font-bold md:text-4xl">A small demo of making Linear regression model <br class="lg:block" hidden /> and some charts for data</h2>
        </div>
        <div class="mt-16 grid border divide-x divide-y rounded-xl overflow-hidden sm:grid-cols-2 lg:divide-y-0 lg:grid-cols-3 xl:grid-cols-4">
            <div class="relative group bg-white transition hover:z-[1] hover:shadow-2xl">
                <div class="relative p-8 space-y-8">
                     
                    <div class="space-y-2">
                        <h5 class="text-xl text-gray-800 font-medium transition group-hover:text-yellow-600">Prepare your file</h5>
                        <p class="text-sm text-gray-600">the file must be EXCEL file and must contain just two columns of numerical values</p>
                    </div>
                   
                </div>
            </div>
            <div class="relative group bg-white transition hover:z-[1] hover:shadow-2xl">
                <div class="relative p-8 space-y-8">
                     
                    <div class="space-y-2">
                        <h5 class="text-xl text-gray-800 font-medium transition group-hover:text-yellow-600">Upload your file </h5>
                        <p class="text-sm text-gray-600">chosse your target column and upload the file</p>
                    </div>
                    
                </div>
            </div>
            <div class="relative group bg-white transition hover:z-[1] hover:shadow-2xl">
                <div class="relative p-8 space-y-8">
                     
                    <div class="space-y-2">
                        <h5 class="text-xl text-gray-800 font-medium transition group-hover:text-yellow-600">Test the model</h5>
                        <p class="text-sm text-gray-600">you can make some predictions using the model that you will get from the server</p>
                    </div>
                    
                </div>
            </div>
            <div class="relative group bg-gray-100 transition hover:z-[1] hover:shadow-2xl lg:hidden xl:block">
                <div class="relative p-8 space-y-8 border-dashed rounded-lg transition duration-300 group-hover:bg-white group-hover:border group-hover:scale-90">
                     
                    <div class="space-y-2">
                        <h5 class="text-xl text-gray-800 font-medium transition group-hover:text-yellow-600">Nice charts</h5>
                        <p class="text-sm text-gray-600">we also provide some charts that make visualization to your data</p>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</div>


































    <main
      className={`flex min-h-screen flex-col items-center justify-between  ${inter.className}`}
    >
     
    
<div class="flex items-center w-full justify-center p-12">
 
  <div class="mx-auto w-full  bg-white">
    <div
      class="py-6 px-9"
       
      
    >
     

      <div class="mb-6 pt-4">
        <label class="mb-5 block text-xl font-semibold text-[#07074D]">
          Upload Excel File
        </label>
<div>
  {existerror == 1?(<h2 className='text-red-700 font-bold text-center'>{error}</h2>):(<></>)}
  {existerror == 2?(<h2 className='text-green-700 font-bold text-center'>your document looks good</h2>):(<></>)}

</div>
        <div class={`mb-8 ${(uploading || finalresult) ? "bg-slate-500":""}`}>
          <input type="file"  disabled={uploading || finalresult} name="file" id="file" accept=".xlsx" class="sr-only" onChange={(e)=>{handleFileChange(e)}} />
          <label
          
            for="file"
            class="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
          >
            <div>
              <span class="mb-2 block text-xl font-semibold text-[#07074D]">
                Drop files here
              </span>
              <span class="mb-2 block text-base font-medium text-[#6B7280]">
                Or
              </span>
              <span
                class="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]"
              >
                Browse
              </span>
            </div>
          </label>
        </div>
{columnsname.length<=0 || existerror == 1?(<div></div>):(<div class="mb-5">
        <label
          for="email"
          class="mb-3 block text-base font-medium text-[#07074D]"
        >
          select the column you want to predict
        </label>
        <select
        value={columnregression}
        onChange={(e) => {
          setcolumnregression(parseInt(e.target.value) );
          
        }}
      >
{columnsname.map((column,index) =>{
  return <option value={index}>{column}</option>
})}
        
        
      </select>
      </div>)}
        

       
{
     file==null?(<></>):(<div class="rounded-md bg-[#F5F7FB] py-4 px-8">
     <div class="flex items-center justify-between">
     <SiMicrosoftexcel color='green'  size={50} />
    
       <span class="truncate pr-3 text-base font-medium text-[#07074D]">
         {name}
       </span>
       <button onClick={()=>{setcolumnsname([]);seturl('');setcompleted(false);setFile(null);seterror('');setname("");setexisterror(0)}} class="text-[#07074D]">
         <svg
           width="10"
           height="10"
           viewBox="0 0 10 10"
           fill="none"
           xmlns="http://www.w3.org/2000/svg"
         >
           <path
             fill-rule="evenodd"
             clip-rule="evenodd"
             d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
             fill="currentColor"
           />
           <path
             fill-rule="evenodd"
             clip-rule="evenodd"
             d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
             fill="currentColor"
           />
         </svg>
       </button>
     </div>
     
   </div>)  }
      </div>

      <div>
        <button
         onClick={async ()=>{await handleSubmit()}}
          class="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
        >
          Send File
        </button>
      </div>
      


 
       {uploading &&  <div>
          Uploading... {progress}%
          <div style={{ width: `${progress}%`, height: '10px', backgroundColor: 'blue' }}></div>
        </div>}

        {progress == 100  && finalresult ?(<div class="flex justify-center items-center flex-col">
 
  <img class="h-16 w-16" src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif" alt=""/>
 <p>computing the model on the server please wait</p>
</div>):(<></>)

        }
        {completed&&(
        <div className='flex justify-center items-center flex-col'>
        
        <div className=' mt-5 bg-green-400 flex justify-center items-center flex-col'>
          <BsFillCheckCircleFill color='green'  size={50} />
<p className='font-bold '> has been successfully computed the model</p>
<p className='font-bold '> you can make prediction for your data </p>



        </div>
        
        <input value={value} onChange={(e)=>{setvalue(e.target.value)}} className='mt-5 border-2 border-gray-950' type='number' placeholder={`enter the ${columnsname[ (columnregression - 1) * -1]}  to predict the${columnsname[columnregression]}  `} ></input>
        <button className='mt-2 bg-blue-600 rounded-md p-2'  onClick={()=>{setpredict(result[0]*value+result[1])}}>predict the {columnsname[ columnregression ]}</button>
        the {columnsname[ columnregression ]} is <p className='text-blue-900 font-bold text-xl'>{predict}</p> 
        
        </div>
        
        )}




{completed&&(
  
<div className='flex justify-center items-center'>
<div className='mt-10 flex justify-center items-center flex-col'>
  <p className='font-bold text-gray-800 text-xl'>select chart type :</p>
  <select
  className='bg-slate-300'
        value={typeofchart}
        onChange={(e) => {
          settypeofchart(e.target.value );
          
        }}
      >
 
    <option value="bar">bar</option>
    <option value="pointcloud">pointcloud</option>
    <option value="scatter">scatter</option>
    <option value="box">box</option>
    <option value="funnel">funnel</option>
    <option value="histogram">histogram</option>
    <option value="violin">violin</option>



 
        
        
      </select>
</div>
<Plot  data={[{
  x:x,y:y,type:typeofchart,mode:"text+lines+markers",marker:{color:"red"},x
}]}
layout={{width:"100%",height:500,title:"title",xaxis:{title:columnsname[columnregression]},yaxis:{title:columnsname[ (columnregression - 1) * -1]}}}

/></div> )}
   
    </div>
  </div>
</div>
    </main>
    </>
  )
}
