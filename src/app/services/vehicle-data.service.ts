import { Injectable } from '@angular/core';
import { VehicleOption, VehicleMake } from '../pages/quote-form/quote-form';

@Injectable({
  providedIn: 'root'
})
export class VehicleDataService {
  private vehicleMakes: VehicleMake[] = [
    {
      id: 'ford',
      name: 'Ford',
      models: [
        { id: 'mustang', name: 'Mustang', types: ['coupe', 'convertible'] },
        { id: 'fusion', name: 'Fusion', types: ['sedan'] },
        { id: 'f150', name: 'F-150', types: ['truck'] },
        { id: 'f250', name: 'F-250', types: ['truck'] },
        { id: 'f350', name: 'F-350', types: ['truck'] },
        { id: 'ranger', name: 'Ranger', types: ['truck'] },
        { id: 'explorer', name: 'Explorer', types: ['suv'] },
        { id: 'escape', name: 'Escape', types: ['suv'] },
        { id: 'bronco', name: 'Bronco', types: ['suv'] },
        { id: 'expedition', name: 'Expedition', types: ['suv'] },
        { id: 'edge', name: 'Edge', types: ['suv'] },
        { id: 'maverick', name: 'Maverick', types: ['truck'] },
        { id: 'transit', name: 'Transit', types: ['van'] }
      ]
    },
    {
      id: 'chevrolet',
      name: 'Chevrolet',
      models: [
        { id: 'camaro', name: 'Camaro', types: ['coupe', 'convertible'] },
        { id: 'malibu', name: 'Malibu', types: ['sedan'] },
        { id: 'silverado', name: 'Silverado 1500', types: ['truck'] },
        { id: 'silverado2500', name: 'Silverado 2500', types: ['truck'] },
        { id: 'silverado3500', name: 'Silverado 3500', types: ['truck'] },
        { id: 'colorado', name: 'Colorado', types: ['truck'] },
        { id: 'equinox', name: 'Equinox', types: ['suv'] },
        { id: 'tahoe', name: 'Tahoe', types: ['suv'] },
        { id: 'suburban', name: 'Suburban', types: ['suv'] },
        { id: 'traverse', name: 'Traverse', types: ['suv'] },
        { id: 'blazer', name: 'Blazer', types: ['suv'] },
        { id: 'trailblazer', name: 'Trailblazer', types: ['suv'] },
        { id: 'express', name: 'Express', types: ['van'] }
      ]
    },
    {
      id: 'toyota',
      name: 'Toyota',
      models: [
        { id: 'camry', name: 'Camry', types: ['sedan'] },
        { id: 'corolla', name: 'Corolla', types: ['sedan', 'hatchback'] },
        { id: 'gr86', name: 'GR86', types: ['coupe'] },
        { id: 'supra', name: 'Supra', types: ['coupe'] },
        { id: 'tacoma', name: 'Tacoma', types: ['truck'] },
        { id: 'tundra', name: 'Tundra', types: ['truck'] },
        { id: 'rav4', name: 'RAV4', types: ['suv'] },
        { id: 'highlander', name: 'Highlander', types: ['suv'] },
        { id: '4runner', name: '4Runner', types: ['suv'] },
        { id: 'sequoia', name: 'Sequoia', types: ['suv'] },
        { id: 'venza', name: 'Venza', types: ['suv'] },
        { id: 'sienna', name: 'Sienna', types: ['van'] }
      ]
    },
    {
      id: 'honda',
      name: 'Honda',
      models: [
        { id: 'civic', name: 'Civic', types: ['sedan', 'hatchback'] },
        { id: 'accord', name: 'Accord', types: ['sedan'] },
        { id: 'ridgeline', name: 'Ridgeline', types: ['truck'] },
        { id: 'cr-v', name: 'CR-V', types: ['suv'] },
        { id: 'hr-v', name: 'HR-V', types: ['suv'] },
        { id: 'pilot', name: 'Pilot', types: ['suv'] },
        { id: 'passport', name: 'Passport', types: ['suv'] },
        { id: 'odyssey', name: 'Odyssey', types: ['van'] }
      ]
    },
    {
      id: 'nissan',
      name: 'Nissan',
      models: [
        { id: 'altima', name: 'Altima', types: ['sedan'] },
        { id: 'maxima', name: 'Maxima', types: ['sedan'] },
        { id: 'sentra', name: 'Sentra', types: ['sedan'] },
        { id: 'frontier', name: 'Frontier', types: ['truck'] },
        { id: 'titan', name: 'Titan', types: ['truck'] },
        { id: 'rogue', name: 'Rogue', types: ['suv'] },
        { id: 'murano', name: 'Murano', types: ['suv'] },
        { id: 'pathfinder', name: 'Pathfinder', types: ['suv'] },
        { id: 'armada', name: 'Armada', types: ['suv'] }
      ]
    },
    {
      id: 'ram',
      name: 'RAM',
      models: [
        { id: 'ram1500', name: 'RAM 1500', types: ['truck'] },
        { id: 'ram2500', name: 'RAM 2500', types: ['truck'] },
        { id: 'ram3500', name: 'RAM 3500', types: ['truck'] },
        { id: 'promaster', name: 'ProMaster', types: ['van'] },
        { id: 'promastercity', name: 'ProMaster City', types: ['van'] }
      ]
    }
  ];

  public getVehicleMakes() {
    return this.vehicleMakes;
  }

  public getMakesByType(typeId: string): VehicleMake[] {
    if (!typeId) return [];
    
    return this.vehicleMakes.filter(make => 
      make.models.some(model => model.types?.includes(typeId))
    );
  }

  public getModelsByMakeAndType(makeId: string, typeId: string): VehicleOption[] {
    if (!makeId || !typeId) return [];

    const selectedMake = this.vehicleMakes.find(make => make.id === makeId);
    if (!selectedMake) return [];

    return selectedMake.models.filter(model => 
      model.types?.includes(typeId)
    );
  }
}
