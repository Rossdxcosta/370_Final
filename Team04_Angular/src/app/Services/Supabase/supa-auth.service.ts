import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupaAuthService {

  constructor() { this.supabase.auth.getUser().then(a => console.log(a.data.user?.aud)) }
  supabase = createClient("https://eyttxpyokidmxsbkbcjm.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5dHR4cHlva2lkbXhzYmtiY2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyNTA5NjEsImV4cCI6MjAzMDgyNjk2MX0.02lOAE9qFZRsU1bSKqLLSyaTs_uVLqHtjxwRjkrBhkQ")

  

}
