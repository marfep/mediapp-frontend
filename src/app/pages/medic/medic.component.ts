import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs';
import { Medic } from 'src/app/model/medic';
import { MedicService } from 'src/app/service/medic.service';
import { PatientComponent } from '../patient/patient.component';
import { MedicDialogComponent } from './medic-dialog/medic-dialog.component';

@Component({
  selector: 'app-medic',
  templateUrl: './medic.component.html',
  styleUrls: ['./medic.component.css']
})
export class MedicComponent implements OnInit {

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'cmp', 'actions'];
  dataSource: MatTableDataSource<Medic>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private medicService: MedicService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.medicService.getMedicChange().subscribe(data => {
      this.createTable(data);
    });

    this.medicService.getMessageChange().subscribe(data => {
      this.snackBar.open('INFO', data, { duration: 2000 });
    });

    this.medicService.findAll().subscribe(data => {
      this.createTable(data);
    });
  }

  createTable(medics: Medic[]) {
    this.dataSource = new MatTableDataSource(medics);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  openDialog(medic?: Medic) {
    this.dialog.open(MedicDialogComponent, {
      width: '250px',
      data: medic,
      disableClose: true
    })
  }

  delete(idMedic: number) {
    this.medicService.delete(idMedic).pipe(switchMap(() => {
      return this.medicService.findAll();
    }))
      .subscribe(data => {
        this.medicService.setMedicChange(data);
        this.medicService.setMessageChange('DELETED!');
      })
      ;
  }

}
