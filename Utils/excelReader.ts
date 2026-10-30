import ExcelJs from 'exceljs';
import {Passenger} from '../types/Bustypes';


export async function Readpassengers(filePath:string ,passengerCount:number):Promise<Passenger[]>{
    const workbook: ExcelJs.Workbook=new ExcelJs.Workbook();
    await workbook.xlsx.readFile(filePath);
    const workSheet:any=workbook.getWorksheet("Sheet1");
    const passengers:Passenger[]=[];
    workSheet.eachRow((row:any,rowNum:any)=>{
        if(rowNum>1 && passengers.length <passengerCount){
            passengers.push({
                name:row.getCell(1).text.trim(),
                age:row.getCell(2).text.trim(),
                gender:row.getCell(3).text.trim()
            });
        }
    })

    if(passengers.length<passengerCount){
        throw new Error(`Excel has only ${passengers.length} passenger records, ` +
            `but ${passengerCount} passengers are required`
        );

    }
    return passengers;


    
} 