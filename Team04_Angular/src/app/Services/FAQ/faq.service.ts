// faq.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FAQ } from '../../Classes/faq.classes';
import { FAQCategory } from '../../Classes/faq-category.classes';
import { FAQWithCategory } from '../../Classes/faq-with-category.classes';

@Injectable({
  providedIn: 'root'
})
export class FAQService {
  private apiUrl = 'http://localhost:5120/api/FAQs';

  constructor(private http: HttpClient) { }

  getAllFAQs(): Observable<FAQ[]> {
    return this.http.get<FAQ[]>(`${this.apiUrl}/GetAllFAQs`);
  }

  getFAQById(id: number): Observable<FAQ> {
    return this.http.get<FAQ>(`${this.apiUrl}/GetFAQByID/${id}`);
  }

  addFAQ(faq: FAQ): Observable<FAQ> {
    return this.http.post<FAQ>(`${this.apiUrl}/AddFAQ`, faq);
  }

  updateFAQ(id: number, faq: FAQ): Observable<FAQ> {
    return this.http.put<FAQ>(`${this.apiUrl}/UpdateFAQ/${id}`, faq);
  }

  deleteFAQ(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteFAQ/${id}`);
  }

  getAllFAQCategories(): Observable<FAQCategory[]> {
    return this.http.get<FAQCategory[]>(`${this.apiUrl}/GetAllFAQCategories`);
  }

  getFAQCategoryById(id: number): Observable<FAQCategory> {
    return this.http.get<FAQCategory>(`${this.apiUrl}/GetFAQCategoryByID/${id}`);
  }

  addFAQCategory(category: FAQCategory): Observable<FAQCategory> {
    return this.http.post<FAQCategory>(`${this.apiUrl}/AddFAQCategory`, category);
  }

  updateFAQCategory(id: number, category: FAQCategory): Observable<FAQCategory> {
    return this.http.put<FAQCategory>(`${this.apiUrl}/UpdateFAQCategory/${id}`, category);
  }

  deleteFAQCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteFAQCategory/${id}`);
  }

  //New
  /*getFAQsAndCategories(): Observable<FAQWithCategory[]> {
    return this.http.get<FAQWithCategory[]>(`${this.apiUrl}/FAQs/GetFAQsAndCategories`);
  }*/

  getFAQsAndCategories(): Observable<FAQWithCategory[]> {
    return this.http.get<FAQWithCategory[]>(`${this.apiUrl}/GetFAQsAndCategories`);
  }
  
}
