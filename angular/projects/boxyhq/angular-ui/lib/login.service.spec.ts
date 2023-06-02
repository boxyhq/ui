import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';

describe('AngularUiService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
