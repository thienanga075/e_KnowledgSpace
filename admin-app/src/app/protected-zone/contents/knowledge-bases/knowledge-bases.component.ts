import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { KnowledgeBase } from './../../../shared/models/knowledge-base.model';
import { MessageConstants } from './../../../shared/constants';
import { Pagination } from './../../../shared/models';
import { NotificationService } from './../../../shared/services';
import { KnowledgeBasesService } from './../../../shared/services/knowledge-bases.service';

@Component({
  selector: 'app-knowledge-bases',
  templateUrl: './knowledge-bases.component.html',
  styleUrls: ['./knowledge-bases.component.css']
})
export class KnowledgeBasesComponent implements OnInit, OnDestroy {

  private subscription = new Subscription();
  // Default
  public blockedPanel = false;
  /**
   * Paging
   */
  public pageIndex = 1;
  public pageSize = 10;
  public pageDisplay = 10;
  public totalRecords: number;
  public keyword = '';
  // Role
  public items: any[];
  public selectedItems = [];
  constructor(private knowledgeBasesService: KnowledgeBasesService,
    private notificationService: NotificationService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(selectedId = null) {
    this.blockedPanel = true;
    this.subscription.add(this.knowledgeBasesService.getAllPaging(this.keyword, this.pageIndex, this.pageSize)
      .subscribe((response: Pagination<KnowledgeBase>) => {
        this.processLoadData(selectedId, response);
        setTimeout(() => { this.blockedPanel = false; }, 1000);
      }, error => {
        setTimeout(() => { this.blockedPanel = false; }, 1000);
      }));
  }
  private processLoadData(selectedId = null, response: Pagination<KnowledgeBase>) {
    this.items = response.items;
    this.pageIndex = this.pageIndex;
    this.pageSize = this.pageSize;
    this.totalRecords = response.totalRecords;
    if (this.selectedItems.length === 0 && this.items.length > 0) {
      this.selectedItems.push(this.items[0]);
    }
    if (selectedId != null && this.items.length > 0) {
      this.selectedItems = this.items.filter(x => x.Id === selectedId);
    }
  }
  pageChanged(event: any): void {
    this.pageIndex = event.page + 1;
    this.pageSize = event.rows;
    this.loadData();
  }

  showAddModal() {
    this.router.navigateByUrl('/contents/knowledge-bases-detail/');
  }
  showEditModal() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    this.router.navigateByUrl('/contents/knowledge-bases-detail/' + this.selectedItems[0].id);
  }

  deleteItems() {
    const id = this.selectedItems[0].id;
    this.notificationService.showConfirmation(MessageConstants.CONFIRM_DELETE_MSG,
      () => this.deleteItemsConfirm(id));
  }
  deleteItemsConfirm(id) {
    this.blockedPanel = true;
    this.subscription.add(this.knowledgeBasesService.delete(id).subscribe(() => {
      this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
      this.loadData();
      this.selectedItems = [];
      setTimeout(() => { this.blockedPanel = false; }, 1000);
    }, error => {
      setTimeout(() => { this.blockedPanel = false; }, 1000);
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
