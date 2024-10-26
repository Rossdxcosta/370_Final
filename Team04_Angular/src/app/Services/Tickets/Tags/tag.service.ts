import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../../../Classes/tags-classes';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  private apiUrl = 'http://localhost:5120/api/Tags';

  constructor(private http: HttpClient) {}

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.apiUrl+'/GetAllTags');
  }

  getTagById(id: number): Observable<Tag> {
    return this.http.get<Tag>(this.apiUrl+'/GetTagByID/'+id);
  }

  addTag(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(this.apiUrl+'/AddTag', tag);
  }

  updateTag(tag: Tag): Observable<void> {
    return this.http.put<void>(this.apiUrl+'/UpdateTag/'+tag.tag_ID, tag);
  }

  deleteTag(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl+'/DeleteTag/'+id);
  }
}