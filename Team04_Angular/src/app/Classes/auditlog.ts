export class Auditlog {
    userId: string;
    type: string;
    tableName: string;
    oldValues: string;
    newValues: string;
    affectedColumns: string[]; 
    primaryKey: string;
    dateTime: string;
  
    constructor() {
      this.userId = '';
      this.type = '';
      this.tableName = '';
      this.oldValues = '';
      this.newValues = '';
      this.affectedColumns = [];
      this.primaryKey = '';
      this.dateTime = '';
    }
  }