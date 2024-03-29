import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

import { UserService } from "../../../core/services/user.service";

@Component({
  selector: "user-profile-page",
  templateUrl: "./profile-page.component.html",
})
export class ProfilePageComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private toastrService = inject(ToastrService);
  private originalProfileForm: any;
  
  public profileForm: FormGroup = this.formBuilder.group({
    names: [{ value: "", disabled: true }, [Validators.required]],
    surnames: [{ value: "", disabled: true }, [Validators.required]],
    email: [{ value: "", disabled: true }, [Validators.required, Validators.email]],
  });
  public editable: boolean = false;

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.userService.getProfile()
      .subscribe({
        next: (res) => {
          this.profileForm.patchValue(res);
          this.originalProfileForm = this.profileForm.getRawValue();
        }
      });
  }

  editProfile() {
    this.userService.editProfile(this.profileForm.value)
      .subscribe({
        next: (res) => {
          this.toastrService.success("Su perfil se actualizó exitosamente");
          this.offEditable(res);
        }
      });
  }

  onEditable() {
    this.editable = true;
    this.profileForm.get("names")?.enable();
    this.profileForm.get("surnames")?.enable();
  }

  offEditable(form: any = this.originalProfileForm) {
    this.editable = false;
    this.profileForm.patchValue(form);
    this.profileForm.get("names")?.disable();
    this.profileForm.get("surnames")?.disable();
  }
}
