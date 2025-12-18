import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ICourseAndStaffData } from '../wxservice/course-and-staff-data';
import { Wxservice } from '../wxservice/wxservice';
import { ICourseData } from '../wxservice/course-data';

@Component({
  selector: 'app-courses',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses implements OnInit, OnDestroy {
  public courseFormData: FormGroup;
  public courses: any = [];
  private chosenCourseId: number;
  private chosenTeacherName: string;
  private chosenStudentCount: number;
  public urlPasser: string;
  env = environment;

  constructor(private service: Wxservice) {
    this.courseFormData = new FormGroup({
      courseId: new FormControl<number>(0, [Validators.min(0), Validators.max(9999), Validators.pattern('[0-9]*')]),
      teacherName: new FormControl<string>('', [Validators.minLength(3), Validators.pattern('[a-zA-Z, ]*')]),
      studentCount: new FormControl<number>(0, [Validators.min(0), Validators.max(99), Validators.pattern('[0-9]*')])
    });

    //Initialization
    this.chosenCourseId = 0;
    this.chosenTeacherName = "";
    this.chosenStudentCount = 0;
    this.urlPasser = "";
   }

  ngOnInit() {
    //Clear out defaults
    this.courseFormData.controls['courseId'].reset();
    this.courseFormData.controls['teacherName'].reset();
    this.courseFormData.controls['studentCount'].reset();
  }

  ngOnDestroy(): void {}

  public onSubmit(courseFormData: { courseId: string | number | null; teacherName: string | null; studentCount: string | number | null; })
  {
    //Checks if there was any user input.
    if((courseFormData.courseId == '' || courseFormData.courseId == null) && (courseFormData.teacherName == '' || courseFormData.teacherName == null) && (courseFormData.studentCount == ''  || courseFormData.studentCount == null))
    {
      alert('All fields empty canceling search!');
    }
    else
    {
      if(courseFormData.courseId == '' || courseFormData.courseId == null)
      {
        courseFormData.courseId = 0;
      }
      if(courseFormData.teacherName == '' || courseFormData.teacherName == null)
      {
        courseFormData.teacherName = 'a';
      }
      if(courseFormData.studentCount == ''  || courseFormData.studentCount == null)
      {
        courseFormData.studentCount = 0;
      }

      if(this.courseFormData.valid)
      {
        if(typeof courseFormData.courseId === 'number')
        {
          this.chosenCourseId = courseFormData.courseId;
        }

        if(typeof courseFormData.teacherName === 'string')
        {
          this.chosenTeacherName = courseFormData.teacherName;
        }

        if(typeof courseFormData.studentCount === 'number')
        {
          this.chosenStudentCount = courseFormData.studentCount;
        }

        this.getCourseAndStaff(this.chosenCourseId, this.chosenTeacherName, this.chosenStudentCount)
      }
      else
      {
        console.log("courseFormData not valid!");
      }
    }
  }

  public processClear()
  {
    this.courseFormData.controls['courseId'].reset();
    this.courseFormData.controls['teacherName'].reset();
    this.courseFormData.controls['studentCount'].reset();
  }

  public processClick()
  {
      this.getCourse();
  }

  public getCourse()
  {
    this.service.getCoursesWX('Courses').subscribe(data => { this.processData(data); },
                                     err => { this.processError(err); });
  }

  public getCourseAndStaff(cid: number, sname: string, scount: number)
  {
    this.urlPasser = "Courses/" + cid.toString() + "/" + sname + "/" + scount.toString();
    this.service.getCoursesAndStaffWX(this.urlPasser).subscribe(data => { this.processData(data); },
                                     err => { this.processError(err); });
  }

  //needed top access form data for validation
  public get courseId()
  {
    return this.courseFormData.get('courseId');
  }

  //needed top access form data for validation
  public get teacherName()
  {
    return this.courseFormData.get('teacherName');
  }

  //needed top access form data for validation
  public get studentCount()
  {
    return this.courseFormData.get('studentCount');
  }

  private processData(data: any) {
      if ( data == null)
      {
        data = 'Course not found!';

      }
      else if (data == '')
      {
        alert('Course not found!');
      }
      else {
        this.courses = data;
      }
    }

    private processError(err: any) {
      alert('Error at CoursesComponent.getStaff call to service likely timeout!');
      console.log('Error at CoursesComponent.getStaff call to service likely timeout!');
    }
}
