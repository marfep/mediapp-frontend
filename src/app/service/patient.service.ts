import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Patient } from '../model/patient';
import { Observable, Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService extends GenericService<Patient>{

  //private url: string = `${environment.HOST}/patients`;
  private patientChange = new Subject<Patient[]>;
  private messageChange = new Subject<string>;
  private patientSel = new Subject<Patient>;

  constructor(protected override http: HttpClient) {
    super(
      http,
      `${environment.HOST}/patients`
    );
  }

  listPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  //constructor(private http: HttpClient) { }

  /*
  findAll() {
    return this.http.get<Patient[]>(this.url);
  }

  findById(id: number){
    return this.http.get<Patient>(`${this.url}/${id}`);
  }

  save(patient: Patient){
    return this.http.post(this.url, patient);
  }

  update(patient: Patient){
    return this.http.put(this.url, patient);
  }

  delete(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }*/

  ///////////////get & set ///////////////////

  setPatientChange(data: Patient[]) {
    this.patientChange.next(data);
  }

  getPatientChange() {
    return this.patientChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }

  setPatientSel(p: Patient) {
    this.patientSel.next(p);
  }

  getPatientSel() {
    return this.patientSel.asObservable();
  }

  
  save2(patient: Patient){
    return this.http.post<Patient>(this.url, patient,{observe:'response'});
  }

  findByURL(url: string){
    return this.http.get<Patient>(`${url}`);
  }

}
