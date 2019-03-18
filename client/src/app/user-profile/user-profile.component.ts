import { Component, OnInit, ViewChild } from '@angular/core';
import { NativeDateAdapter } from '@angular/material';
import { SettingsService } from '../_services/settings.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  @ViewChild('output')
  fileInput;
  avatarBase64: string;

  constructor(
    private settingsService: SettingsService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getUser().subscribe(res => {
      this.fileInput.nativeElement.src = res.avatarImg;
    });
  }

  openFile(event) {
    let input = event.target;

    let reader = new FileReader();

    reader.onload = () => {
      let dataURL = reader.result;
      this.avatarBase64 = dataURL as string;
      this.fileInput.nativeElement.src = dataURL;
    };

    reader.onprogress = data => {
      if (data.lengthComputable) {
        var progress = Math.round((data.loaded / data.total) * 100);
        console.log(progress);
      }
    };
    reader.readAsDataURL(input.files[0]);
  }

  saveAvatar() {
    this.userService.setUser({ avatarImg: this.avatarBase64 });
  }
  deleteAvatar() {
    this.userService.setUser({ avatarImg: undefined });
    this.avatarBase64 = undefined;
  }
}
