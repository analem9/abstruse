import { DebugElement, NO_ERRORS_SCHEMA }          from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { AppHeaderComponent } from './app-header.component';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { ConfigService } from '../../services/config.service';
import { NotificationService } from '../../services/notification.service';

describe('Header Component', () => {
  let fixture: ComponentFixture<AppHeaderComponent>;

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZ21haWwuY29tIiwiaWQiOjE'
        + 'sImZ1bGxuYW1lIjoiSm9obiBXYXluZSIsInBhc3N3b3JkIjoiY2MwM2U3NDdhNmFmYmJjYmY4YmU3NjY4YW'
        + 'NmZWJlZTUiLCJhZG1pbiI6MSwiYXZhdGFyIjoiL2F2YXRhcnMvdXNlci5zdmciLCJjcmVhdGVkX2F0IjoxN'
        + 'TA3Mjg2NDUzOTYwLCJ1cGRhdGVkX2F0IjoxNTA3Mjg2NDUzOTYwLCJpYXQiOjE1MDczMDY1NzF9.tKDsUid'
        + 'LjHKVjb9IT612yf6yMM1DtT5H9fmn5wIBdhE';
    });

    fixture = TestBed.configureTestingModule({
      imports: [ FormsModule, RouterTestingModule, HttpModule ],
      declarations: [ AppHeaderComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        ApiService,
        AuthService,
        SocketService,
        ConfigService,
        NotificationService ]
    })
    .createComponent(AppHeaderComponent);
  });

  it('should expect user to be undefined', () => {
    expect(fixture.componentInstance.user).toBeUndefined();
  });

  it('should expect user to be John', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance.user.email).toBe('john@gmail.com');
  });

  it('should expect item text to include Dashboard', () => {
    fixture.detectChanges();
    const de = fixture.debugElement.query(By.css('.nav-item:nth-child(2)'));
    expect(de.nativeElement.textContent).toContain('Dashboard');
  });

  it('should expect navigation item to show after click', () => {
    fixture.detectChanges();
    const deMenu = fixture.debugElement.query(By.css('.user-item'));
    if (deMenu instanceof HTMLElement) {
      deMenu.click();
    } else {
      deMenu.triggerEventHandler('click', { button: 0 });
    }
    expect(fixture.componentInstance.menuDropped).toBe(true);
  });

});
