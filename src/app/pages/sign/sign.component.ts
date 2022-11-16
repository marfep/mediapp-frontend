import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs';
import { Sign } from 'src/app/model/sign';
import { SignService } from 'src/app/service/sign.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {

  displayedColumns: string[] = ['id', 'patient', 'registerDate', 'temperature', 'pulse', 'respiratoryRate', 'actions'];
  dataSource: MatTableDataSource<Sign>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  totalElements: number;

  constructor(
    private signService: SignService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.signService.getSignChange().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.signService.getMessageChange().subscribe(data => {
      this.snackBar.open('INFO', data, { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
    });

    this.signService.listPageable(0, 3).subscribe(data => {
      this.dataSource = new MatTableDataSource(data.content);
      this.totalElements = data.totalElements;
    });
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idSign: number) {
    this.signService.delete(idSign).pipe(switchMap(() => {
      return this.signService.findAll();
    }))
      .subscribe(data => {
        this.signService.setSignChange(data);
        this.signService.setMessageChange('DELETED!');
      });
  }

  showMore(e: any){
    this.signService.listPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.dataSource = new MatTableDataSource(data.content);
      this.totalElements = data.totalElements;
    });
  }

}
