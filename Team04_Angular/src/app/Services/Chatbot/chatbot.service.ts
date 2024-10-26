import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { request } from '../../Classes/chatbot-classes';
import { Observable, switchMap } from 'rxjs';
import { Chat } from '../../Classes/messages';
import { ChatbotLog } from '../../Classes/chatbot_log';
import { UserServiceService } from '../Users/user-service.service';
import { Tag } from '../../Classes/tags-classes';
import { TagsService } from '../Tickets/Tags/tag.service';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  headers = {
    'content-type': 'application/json',
    'Authorization': 'VF.DM.66be7523b1a982bcb5022b1e.AYvxvXSLKJ8KXxwN'
  }

  constructor(private http: HttpClient, private userService: UserServiceService) { }
  api = "https://general-runtime.voiceflow.com/state/user/"
  url = "http://localhost:5120/WeatherForecast/"

  public interact(request: any, chatID: number): Observable<any> {
    console.log(request);

    return this.http.post<any>(
      this.api + encodeURI(this.userService.getUserIDFromToken()) + "/interact",
      JSON.stringify({ request }),
      { headers: this.headers }
    ).pipe(
      // Switch to a new observable that makes the second request
      switchMap(response => {
        console.log('First request completed:', response);
        this.http.patch<any>(
          this.api + encodeURI(this.userService.getUserIDFromToken()) + "/variables",
          JSON.stringify({
            "user_id": this.userService.getUserIDFromToken(),
"chatID": chatID,
"Ticket_Tag": 1
          }),
          { headers: this.headers }
        ).subscribe();
        // Make the second request
        return this.http.post<any>(
          this.api + this.userService.getUserIDFromToken() + "/interact",
          JSON.stringify({ request }),
          { headers: this.headers }
        );
      })
    );
  }

  public uploadTags(tags: Tag[]) {
    return this.http.get<any>(
      "https://api.voiceflow.com/v1/knowledge-base/docs?page=1&limit=100",
      { headers: this.headers }
    ).pipe(
      switchMap(res => {
        const existingTags = res.data.filter((el: any) => el.data.type == "table");

        if (existingTags.length === 0) {
          // If no existing tags are found, skip the delete operation
          return this.uploadNewTags(tags);
        } else {
          // If existing tags are found, proceed with delete and then upload
          return this.http.delete<any>(
            "https://api.voiceflow.com/v1/knowledge-base/docs/" + existingTags[0].documentID,
            { headers: this.headers }
          ).pipe(
            switchMap(() => this.uploadNewTags(tags))
          );
        }
      })
    );
  }

  private uploadNewTags(tags: Tag[]) {
    console.log("Uploading new tags");
    return this.http.post<any>(
      "https://api.voiceflow.com/v1/knowledge-base/docs/upload/table",
      JSON.stringify({
        "data": {
          "schema": {
            "searchableFields": [
              "tag_ID",
              "tag_Name"
            ],
            "metadataFields": [
              "This is the list of tags that a ticket can have"
            ]
          },
          "name": "tags",
          "items": tags
        }
      }),
      { headers: this.headers }
    );
  }

  public deleteDoc(id: String): Observable<any> {
    return this.http.delete<any>('https://api.voiceflow.com/v1/knowledge-base/docs/' + id, { "headers": this.headers });
  }

  public uploadURL(url: String): Observable<any> {
    const data = {
      "data": {
        "type": "url",
        "url": url
      }
    };
    return this.http.post<any>('https://api.voiceflow.com/v3alpha/knowledge-base/docs/upload?maxChunkSize=1000', data, { "headers": this.headers });
  }

  public uploadDoc(doc: any): Observable<any> {
    console.log(doc);
    const data = {
      "data": {
        "type": "multipart/form-data",
        "url": doc
      }
    };
    return this.http.post<any>('https://api.voiceflow.com/v1/knowledge-base/docs/upload?maxChunkSize=1000', data, { "headers": this.headers });
  }

  public getClientLogs(): Observable<ChatbotLog[]> {
    return this.http.get<ChatbotLog[]>("http://localhost:5120/api/Chat/GetClientLogs");
  }

  public startChat(email: string): Observable<string> {
    return this.http.get<string>("http://localhost:5120/api/Chat/StartChat/" + email)
  }

  public dismissChat(id: string) {
    return this.http.get<any>("http://localhost:5120/api/Chat/DismissChat/" + id);
  }

  // public saveChat(id: String, chat: Chat): Observable<any>{
  //   return this.http.post(this.url + "TestChat", id, chat)
  // }
  //--------------------------------------------------Above is voiceflow-------------------------------------------------------------------------------------------

  public GetChats(): Observable<ChatbotLog[]> {
    return this.http.get<ChatbotLog[]>("http://localhost:5120/api/Chat/GetOpenLogs")
  }

  public handoverChat(id: string) {
    return this.http.get<any>("http://localhost:5120/api/Chat/CreateHandover/" + id);
  }

  public ClaimChat(id: string): Observable<any> {
    let request = { chatID: id, empID: this.userService.getUserIDFromToken() }
    return this.http.put<any>("http://localhost:5120/api/Chat/ClaimChat", request)
  }
}
