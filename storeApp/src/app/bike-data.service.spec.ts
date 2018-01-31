import { TestBed, inject } from '@angular/core/testing';

import { BikeDataService } from './bike-data.service';

describe('BikeDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BikeDataService]
    });
  });

  it('should be created', inject([BikeDataService], (service: BikeDataService) => {
    expect(service).toBeTruthy();
  }));
});
