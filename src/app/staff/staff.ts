import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { IStaffData } from '../wxservice/staff-data';
import { Wxservice } from '../wxservice/wxservice';

@Component({
  selector: 'app-staff',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './staff.html',
  styleUrl: './staff.scss',
})

export class Staff {
  public staffFormData: FormGroup;
  private chosenStaff: string;             // form input
  public isButton: boolean;
  public isButtonAll: boolean;
  public selectedCity = '';
  public selectedStaff = '';
  public staffData: IStaffData | any = <IStaffData>{};
  public staffs: any = [];
  env = environment;

  constructor(private service: Wxservice) {      // dependency injection of service object
    this.isButton = false;
    this.isButtonAll = false;
     this.staffFormData = new FormGroup({
      staffName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z, ]*')])
    });    // init any HTML items as needed

    //Initialization
    this.chosenStaff = "";
  }

  ngOnInit() {
  }

  ngOnDestroy() {}


  public onSubmit(staffFormData: { staffName: string; value: any; }) {
      if(this.staffFormData.valid)
      {
        this.chosenStaff = staffFormData.staffName;
        this.getStaffByName(this.chosenStaff);
      }

      //logging
      console.log('Form Submitted!', staffFormData.value);
      console.log('Form Data:', this.chosenStaff);
  }


  public processClick()
  {
      this.getStaff();
  }

  public getStaff()
  {
    this.service.getStaffWX('staff').subscribe(data => { this.processData(data); },
                                     err => { this.processError(err); });
  }

  public getStaffById(staffId: string)
  {
    this.service.getStaffWX('staff/'+ staffId).subscribe(data => { this.processData(data); },
                                     err => { this.processError(err); });
  }

  public getStaffByName(staffName: string)
  {
    this.service.getStaffWX('staff/searcher/'+ staffName).subscribe(data => { this.processData(data); },
                                     err => { this.processError(err); });
  }

  //needed top access form data for validation
  public get staffName ()
  {
      return this.staffFormData.get('staffName');
  }

  private processData(data: string | IStaffData | null) {
    if ( data == null)
    {
      data = 'Staff not found!';

    }
    else if (data == '')
    {
      alert('Staff not found!');
    }
    else {
      this.staffs = data;
    }
  }

  private processError(err: any) {
    alert('Error at StaffComponent.getStaff call to service likely timeout!');
    console.log('Error at StaffComponent.getStaff call to service likely timeout!');
  }


}
