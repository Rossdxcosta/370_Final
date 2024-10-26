import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { UserServiceService } from '../Users/user-service.service';

@Injectable({
  providedIn: 'root'
})
export class ImagesUploadService {

  constructor(private userService: UserServiceService) { }

  supabase = createClient("https://eyttxpyokidmxsbkbcjm.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5dHR4cHlva2lkbXhzYmtiY2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyNTA5NjEsImV4cCI6MjAzMDgyNjk2MX0.02lOAE9qFZRsU1bSKqLLSyaTs_uVLqHtjxwRjkrBhkQ")

  async uploadImage(imageFile: any) {
    return await this.supabase.storage.from('avatars').update(this.userService.getUserIDFromToken() + "/avatar.png", imageFile, {
      cacheControl: '3600',
      upsert: false
    }).then(bruh => {
      if(bruh.error){
         this.supabase.storage.from('avatars').upload(this.userService.getUserIDFromToken() + "/avatar.png", imageFile, {
          cacheControl: '3600',
          upsert: false
        })
      }
    })
  }

  async downloadImage() {
    return await this.supabase.storage.from('avatars').download(this.userService.getUserIDFromToken() + "/avatar.png")
  }
}
