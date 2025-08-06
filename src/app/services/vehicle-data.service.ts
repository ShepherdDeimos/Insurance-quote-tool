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
      id: 'subaru',
      name: 'Subaru',
      models: [
        { id: 'impreza', name: 'Impreza', types: ['sedan', 'hatchback'] },
        { id: 'legacy', name: 'Legacy', types: ['sedan'] },
        { id: 'wrx', name: 'WRX', types: ['sedan'] },
        { id: 'brz', name: 'BRZ', types: ['coupe'] },
        { id: 'outback', name: 'Outback', types: ['wagon', 'suv'] },
        { id: 'forester', name: 'Forester', types: ['suv'] },
        { id: 'crosstrek', name: 'Crosstrek', types: ['suv'] },
        { id: 'ascent', name: 'Ascent', types: ['suv'] }
      ]
    },
    {
      id: 'mazda',
      name: 'Mazda',
      models: [
        { id: 'mazda3', name: 'Mazda3', types: ['sedan', 'hatchback'] },
        { id: 'mazda6', name: 'Mazda6', types: ['sedan'] },
        { id: 'mx5', name: 'MX-5 Miata', types: ['convertible'] },
        { id: 'cx3', name: 'CX-3', types: ['suv'] },
        { id: 'cx30', name: 'CX-30', types: ['suv'] },
        { id: 'cx5', name: 'CX-5', types: ['suv'] },
        { id: 'cx9', name: 'CX-9', types: ['suv'] },
        { id: 'cx90', name: 'CX-90', types: ['suv'] }
      ]
    },
    {
      id: 'volkswagen',
      name: 'Volkswagen',
      models: [
        { id: 'jetta', name: 'Jetta', types: ['sedan'] },
        { id: 'passat', name: 'Passat', types: ['sedan'] },
        { id: 'arteon', name: 'Arteon', types: ['sedan'] },
        { id: 'golf', name: 'Golf', types: ['hatchback'] },
        { id: 'gti', name: 'GTI', types: ['hatchback'] },
        { id: 'taos', name: 'Taos', types: ['suv'] },
        { id: 'tiguan', name: 'Tiguan', types: ['suv'] },
        { id: 'atlas', name: 'Atlas', types: ['suv'] },
        { id: 'atlascross', name: 'Atlas Cross Sport', types: ['suv'] }
      ]
    },
    {
      id: 'hyundai',
      name: 'Hyundai',
      models: [
        { id: 'elantra', name: 'Elantra', types: ['sedan'] },
        { id: 'sonata', name: 'Sonata', types: ['sedan'] },
        { id: 'venue', name: 'Venue', types: ['suv'] },
        { id: 'kona', name: 'Kona', types: ['suv'] },
        { id: 'tucson', name: 'Tucson', types: ['suv'] },
        { id: 'santafe', name: 'Santa Fe', types: ['suv'] },
        { id: 'palisade', name: 'Palisade', types: ['suv'] }
      ]
    },
    {
      id: 'kia',
      name: 'Kia',
      models: [
        { id: 'forte', name: 'Forte', types: ['sedan'] },
        { id: 'k5', name: 'K5', types: ['sedan'] },
        { id: 'stinger', name: 'Stinger', types: ['sedan'] },
        { id: 'soul', name: 'Soul', types: ['wagon'] },
        { id: 'seltos', name: 'Seltos', types: ['suv'] },
        { id: 'sportage', name: 'Sportage', types: ['suv'] },
        { id: 'sorento', name: 'Sorento', types: ['suv'] },
        { id: 'telluride', name: 'Telluride', types: ['suv'] },
        { id: 'carnival', name: 'Carnival', types: ['van'] }
      ]
    },
    {
      id: 'nissan',
      name: 'Nissan',
      models: [
        { id: 'versa', name: 'Versa', types: ['sedan'] },
        { id: 'sentra', name: 'Sentra', types: ['sedan'] },
        { id: 'altima', name: 'Altima', types: ['sedan'] },
        { id: 'maxima', name: 'Maxima', types: ['sedan'] },
        { id: 'z', name: 'Z', types: ['coupe'] },
        { id: 'kicks', name: 'Kicks', types: ['suv'] },
        { id: 'rogue', name: 'Rogue', types: ['suv'] },
        { id: 'murano', name: 'Murano', types: ['suv'] },
        { id: 'pathfinder', name: 'Pathfinder', types: ['suv'] },
        { id: 'armada', name: 'Armada', types: ['suv'] },
        { id: 'frontier', name: 'Frontier', types: ['truck'] },
        { id: 'titan', name: 'Titan', types: ['truck'] }
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
    
    console.log('Getting makes for type:', typeId);
    const filteredMakes = this.vehicleMakes.filter(make => 
      make.models.some(model => {
        const isMatch = model.types && 
                       model.types.includes(typeId) && 
                       // For strict type matching, ensure it's exactly the type we want
                       (model.types.length === 1 && model.types[0] === typeId);
        return isMatch;
      })
    );
    
    console.log('Filtered makes:', filteredMakes.map(m => m.name));
    return filteredMakes;
  }

  public getModelsByMakeAndType(makeId: string, typeId: string): VehicleOption[] {
    if (!makeId || !typeId) return [];

    console.log('Getting models for make:', makeId, 'and type:', typeId);
    const selectedMake = this.vehicleMakes.find(make => make.id === makeId);
    if (!selectedMake) return [];

    const filteredModels = selectedMake.models.filter(model => {
      const isMatch = model.types && 
                     model.types.includes(typeId) && 
                     // For strict type matching, ensure it's exactly the type we want
                     (model.types.length === 1 && model.types[0] === typeId);
      return isMatch;
    });
    
    console.log('Filtered models:', filteredModels.map(m => m.name));
    return filteredModels;
  }
}
