import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Data, Router } from '@angular/router';
import * as moment from 'moment';
import { map, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { Sign } from 'src/app/model/sign';
import { PatientService } from 'src/app/service/patient.service';
import { SignService } from 'src/app/service/sign.service';
import { PatientDialogComponent } from '../../patient/patient-dialog/patient-dialog.component';

@Component({
  selector: 'app-sign-edit',
  templateUrl: './sign-edit.component.html',
  styleUrls: ['./sign-edit.component.css']
})
export class SignEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;
  patientControl: FormControl = new FormControl();
    
  patients: Patient[];
  patientsFiltered$: Observable<Patient[]>;
  
  

  maxDate: Date = new Date();

  constructor(
    private signService: SignService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      'idSign' : new FormControl(0),
      'patient': this.patientControl,
      'registerDate' : new FormControl(new Date,[Validators.required]),
      'temperature' : new FormControl('', [Validators.required]),
      'pulse' : new FormControl('', [Validators.required]),
      'respiratoryRate' : new FormControl('', [Validators.required])
    });

    this.loadInitialData();

    this.patientsFiltered$ = this.patientControl.valueChanges.pipe(map(val => this.filterPatients(val)));

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });

    this.patientService.getPatientChange().subscribe(data => this.patients = data);
    this.patientService.getPatientSel().subscribe(data => this.patientControl.patchValue(data));
  }

  loadInitialData() {
    //this.patientService.findAll().subscribe(data => this.patients = data); 
    this.patientService.findAll().subscribe(data => {
      this.patientService.setPatientChange(data)
    }); 
    
  }

  filterPatients(val: any) {
    if (val?.idPatient > 0) {
      return this.patients.filter(el =>
        el.firstName.toLowerCase().includes(val.firstName.toLowerCase()) || el.lastName.toLowerCase().includes(val.lastName.toLowerCase()) || el.dni.includes(val)
      )
    } else {
      return this.patients.filter(el =>
        el.firstName.toLowerCase().includes(val?.toLowerCase()) || el.lastName.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
      );
    }
  }
  
  showPatient(val: any) {
    return val ? `${val.firstName} ${val.lastName}` : val;
  }

  initForm(){
    if(this.isEdit){
      this.signService.findById(this.id).subscribe(data => {        
        this.form = new FormGroup({
          'idSign' : new FormControl(data.idSign),
          'patient': this.patientControl,
          'registerDate' : new FormControl(data.registerDate,[Validators.required]),
          'temperature' : new FormControl(data.temperature, [Validators.required]),
          'pulse' : new FormControl(data.pulse, [Validators.required]),
          'respiratoryRate' : new FormControl(data.respiratoryRate, [Validators.required])
        });
        //this.patientControl.patchValue(data.patient);
        this.patientService.setPatientSel(data.patient);
      });
    }
  }

  operate(){
    if(this.form.invalid){ return; }

    let sign = new Sign();
    sign.idSign = this.form.value['idSign'];
    sign.patient = this.form.value['patient'];
    sign.registerDate = moment(this.form.value['registerDate']).format('YYYY-MM-DDTHH:mm:ss');
    sign.temperature = this.form.value['temperature'];
    sign.pulse = this.form.value['pulse'];
    sign.respiratoryRate = this.form.value['respiratoryRate'];
    
    if(this.isEdit){
      //MODIFICAR
      this.signService.update(sign).subscribe(() => {
        this.signService.findAll().subscribe(data => {
          this.signService.setSignChange(data);
          this.signService.setMessageChange('UPDATED...!');
        });
      });      
    }else{
      //INSERTAR
      this.signService.save(sign).pipe(switchMap(()=>{
        return this.signService.findAll();
      }))
      .subscribe(data => {
        this.signService.setSignChange(data);
        this.signService.setMessageChange('CREATED!');
      });
    }
    this.router.navigate(['/pages/sign']);
    
  }

  get f(){
    return this.form.controls;
  }

  openDialog(patient?: Patient) {
    this.dialog.open(PatientDialogComponent, {
      width: '350px',
      data: patient,
      disableClose: true
    })
  }

}
