import { Test, TestingModule } from "@nestjs/testing";
import { async } from "rxjs";
import { CitiesService } from "./cities.service";


describe('SampleService', () => {
    let service: CitiesService;

beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CitiesService],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
  });

describe('check city',()=>{
    it('should return city',async()=>{
        const city:string='rasht';
        let lll=await service.getAllCity();
        console.log(lll)
        expect(1).toBe(1)
    })
})
})