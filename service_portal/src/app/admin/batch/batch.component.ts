import { AdminService } from './../../admin.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.scss']
})
export class BatchComponent implements OnInit {
  batchInfo:any;

  constructor(private admindata:AdminService,private router:Router) { }

  ngOnInit(): void {
    this.admindata.batch().subscribe(
      (data)=>{
        this.batchInfo=data;
        console.log(data);
      },(err)=>{
        this.router.navigate(['adminLogin']);
      }
    );
  }

}
