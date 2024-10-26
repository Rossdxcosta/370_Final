export interface ToDoList {
    to_do_List_ID: number;
    ticket_ID: number;
    item_Description?: string;
    is_Completed: boolean;
  }
  
  export interface ToDoListItem {
    to_Do_Note_ID: number;
    ticket_ID: number;
    note_Description: string;
  }
  