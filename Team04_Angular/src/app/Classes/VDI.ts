export class VDI {
  vdI_ID: number = 0;         
  vdI_Type_ID: number = 0;     
  vdI_Name: string = '';       
  VDI_Description: string = ''; 
  vdi_Type?: VDIType;          
}

export class VDIType {
  vdI_Type_ID: number = 0;           
  vdI_Type_Name: string = '';         
  vdI_Type_Description: string = ''; 
}
