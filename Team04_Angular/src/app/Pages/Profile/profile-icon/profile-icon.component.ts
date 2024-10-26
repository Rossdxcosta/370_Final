import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../../Services/Users/user-service.service';
import { createAvatar } from '@dicebear/core';
import { lorelei, notionists } from '@dicebear/collection';
import { ImplicitReceiver } from '@angular/compiler';
import { ImagesUploadService } from '../../../Services/Supabase/images-upload.service';

@Component({
  selector: 'app-profile-icon',
  templateUrl: './profile-icon.component.html',
  styleUrl: './profile-icon.component.scss',
  standalone: true,
  imports: []
})
export class ProfileIconComponent implements AfterViewInit {
  constructor(private service: UserServiceService, private ius: ImagesUploadService) {}

  profileIcon: string = '';

  ngAfterViewInit(): void {
    this.ius.downloadImage().then(e => {
      let url = URL.createObjectURL(e.data!)
      this.profileIcon = url;
    })
    .catch(e => {
      let avatar = createAvatar(notionists, {
        seed: this.service.getUserNameFromToken()
      });
    
      this.profileIcon = avatar.toDataUri();
    })
  }
}
