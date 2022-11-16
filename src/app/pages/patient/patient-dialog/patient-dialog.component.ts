import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.css']
})
export class PatientDialogComponent implements OnInit {
  
  form: FormGroup;
  url: string;

  constructor(
    private dialogRef: MatDialogRef<PatientDialogComponent>,
    private patientService: PatientService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idPatient': new FormControl(0),
      'firstName': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'lastName': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'dni': new FormControl('', [Validators.required, Validators.maxLength(8)]),
      'address': new FormControl(''),
      'phone': new FormControl('', [Validators.required, Validators.minLength(9)]),
      'email': new FormControl('', [Validators.required, Validators.email])
    });
  }

  operate() {
    if (this.form.invalid) { return; }

    let patient = new Patient();
    patient.idPatient = this.form.value['idPatient'];
    patient.firstName = this.form.value['firstName'];
    patient.lastName = this.form.value['lastName'];
    patient.dni = this.form.value['dni'];
    patient.address = this.form.value['address'];
    patient.phone = this.form.value['phone'];
    patient.email = this.form.value['email'];

    //INSERTAR
    /*
    this.patientService.save2(patient).subscribe(resp => {      
      //console.log(resp.headers);
      //console.log(resp.headers.get('Location'));
        //const keys = resp.headers.keys();
        //this.headers = keys.map(key =>
        //`${key}: ${resp.headers.get(key)}`);
        //console.log(this.headers);
        //console.log(keys);
        this.patientService.findAll().subscribe(data => {
          this.patientService.setPatientChange(data);
          this.patientService.setMessageChange('CREATED!');
        });
        this.patientService.findByURL(resp.headers.get('Location')).subscribe(
          data => this.patientService.setPatientSel(data)
        );
    });*/

    /*
    this.patientService.save2(patient).pipe(switchMap(resp =>{
      this.url = resp.headers.get('Location');
      return this.patientService.findAll();
    })).subscribe(data => {
      this.patientService.setPatientChange(data);
      this.patientService.setMessageChange('CREATED!');
      this.patientService.findByURL(this.url).subscribe(
        data => this.patientService.setPatientSel(data)
      );
    });
    */

    this.patientService.save2(patient).pipe(switchMap(resp =>{
      this.url = resp.headers.get('Location');
      return this.patientService.findAll();
    })).pipe(switchMap(data => {
      this.patientService.setPatientChange(data);
      this.patientService.setMessageChange('CREATED!');
      return this.patientService.findByURL(this.url);
    }))
    .subscribe(
        data => this.patientService.setPatientSel(data)
    );
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

  get f() {
    return this.form.controls;
  }
  
}
