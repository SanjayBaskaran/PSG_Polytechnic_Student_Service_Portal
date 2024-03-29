import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BonafideService } from 'src/app/bonafide.service';
import { UserDataService } from 'src/app/user-data.service';

@Component({
  selector: 'app-responses',
  templateUrl: './responses.component.html',
  styleUrls: ['./responses.component.scss']
})
export class ResponsesComponent implements OnInit {
  studentBio:any;
  info:any;
  responses:any;
  loading:boolean=true;
  constructor(private userdata:UserDataService,private router:Router,private bonafide:BonafideService) { }

  ngOnInit(): void {
    this.userdata.authCheck().subscribe(
      (data:any)=>{
        this.studentBio=data;
        this.bonafide.responses(data.rno).subscribe(
          responses=>{
            this.responses=responses;
            this.loading=false;
            this.userdata.generateBonafide(this.studentBio.rno).subscribe((data:any)=>{
              this.info=data;
              console.log(this.info);
            });
           },
          err=>{
            alert("can't fetch responses");
          }
        )

        },
       (err)=>{
         this.router.navigate(["/login"])
         }
    )
   
  }
  generatePDF(bonafideId:number){
    //console.log(this.studentBio);
    let doc=new jsPDF('p','mm','a4');
    doc.setFontSize(20);//font size
    doc.setFont('times');//font style
    doc.text("PSG Polytechnic College",75,25);
    //(string,x axis,y axis)
    let img='./assets/logo.png';
    //doc.addImage(img,'png',15,15,20,18);
    doc.setFontSize(16);
    doc.text('BONAFIDE CERTIFICATE',78,40);
    doc.setFontSize(14);

    doc.text('This is to certify that',40,70);
    doc.text(this.studentBio.stud_name,85,70);

    doc.text('S/o or D/o',130,70);
    doc.text(this.studentBio.father_name,165,70);

    doc.text('bearing Roll no.',15,80);
    doc.text(this.studentBio.rno,50,80);

    doc.text('is a bonafide student of PSG Polytechnic College, Coimbatore ',75,80);
    doc.text('pursuing Diploma in ',15,90);
    doc.text(this.info.programme,60,90);

    doc.text('currently in the',90,90);
    doc.text('academic year ',130,90);

    doc.text('2022',170,90);
    doc.text('in '+this.info.duration,182,90);

    doc.text('semester.',15,100);
    doc.text('This certificate is issued for the purpose of ',35,100);
    doc.text('scholarship',121,100);
    doc.text('.',152,100);

    doc.text('DATE: ',15,130);
    doc.text('PLACE: ',15,140);
    doc.text('Signature of Head of the Department',15,170);
    doc.text('Signature of Head of the Instituition',125,170);
    doc.addImage(img,'png',180,15,15,16);//(imgsrc,x,y,width,height)
    console.log('qr'+bonafideId);
    let bid = 'qr'+bonafideId;
    const qrc=document.getElementById(bid);
    console.log(qrc);
    html2canvas(qrc as any).then(canvas =>{
      const imgWidth = 100;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL=canvas.toDataURL('image/png');
      doc.addImage(contentDataURL,'png',55,180,imgWidth, imgHeight);
      doc.save(this.studentBio.rno+'.pdf');
    });
    //doc.save(this.studentBio.rno+'.pdf');
  }
}
