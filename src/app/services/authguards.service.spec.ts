import { TestBed, inject } from '@angular/core/testing';

import { AuthguardsService } from './authguards.service';

describe('AuthguardsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthguardsService]
    });
  });

  it('should be created', inject([AuthguardsService], (service: AuthguardsService) => {
    expect(service).toBeTruthy();
  }));
});
