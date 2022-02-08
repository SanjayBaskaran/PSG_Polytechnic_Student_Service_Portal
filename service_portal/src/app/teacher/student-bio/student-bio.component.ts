import { DomSanitizer } from '@angular/platform-browser';
import { UserDataService } from 'src/app/user-data.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentStudentService } from 'src/app/current-student.service';

@Component({
  selector: 'app-student-bio',
  templateUrl: './student-bio.component.html',
  styleUrls: ['./student-bio.component.scss']
})
export class StudentBioComponent implements OnInit {
  students: any;
  restructuredStudents:any;
  image: Array<any> = [];
  loading: boolean = true;
  constructor(private userdata: UserDataService, private router: Router, private currStudent: CurrentStudentService, private domsanitize: DomSanitizer) { }

  ngOnInit(): void {
    this.userdata.studentBio().subscribe(
      (data: any) => {
        this.students = data;
        this.restructuredStudents = {};
        this.students.forEach(
          (element:any) => {
            if (!this.restructuredStudents[element.dept_id]) {
              this.restructuredStudents[element.dept_id] = {};
            }
            if (!this.restructuredStudents[element.dept_id][element.programme_name]) {
              this.restructuredStudents[element.dept_id][element.programme_name] = {};
            }
            if (!this.restructuredStudents[element.dept_id][element.programme_name][element.batch_id]) {
              this.restructuredStudents[element.dept_id][element.programme_name][element.batch_id] = {};
            }
            if (!this.restructuredStudents[element.dept_id][element.programme_name][element.batch_id][element.rno]) {
              this.restructuredStudents[element.dept_id][element.programme_name][element.batch_id][element.rno] = {};
            }
            this.restructuredStudents[element.dept_id][element.programme_name][element.batch_id][element.rno] = element;
          }
        );
        console.log(this.restructuredStudents);
        for (let i = 0; i < this.students.length; i++) {
          let TYPED_ARRAY = new Uint8Array(data[i].photo.data);
          const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
            return data + String.fromCharCode(byte);
          }, '');
          let base64String = btoa(STRING_CHAR);
          this.image[i] = this.domsanitize.bypassSecurityTrustUrl(
            'data:image/jpg;base64, ' + base64String
          );
        }
        this.loading = false;
      },
      err => {
        console.log(err);
      }
    );
  }
  studentBio(index: number) {
    console.log(this.students[index]);
    this.currStudent.student = this.students[index];
    this.router.navigate(["teacher/studentdetails"]);
  }
}
