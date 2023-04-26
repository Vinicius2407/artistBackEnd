import { Request, Response } from "express";
import { AppError } from "../handlers/errors.handler";
import eventRepository from "../repositories/event.repository";
import eventCategoriesRepository from "../repositories/event_categories.repository";
import addressRepository from "../repositories/address.repository";

class EventController {
  async create(request: Request, response: Response) {
    const { name, description, dh_event,dh_expiration, address, user, categories } = request.body;

                  
    if (!name || !description || !dh_event || !dh_expiration || !address || !user || !categories ) {
      const missingFields = [];

      if (!name) missingFields.push("name");
      if (!description) missingFields.push("description");
      if (!dh_event) missingFields.push("dh_event");
      if (!dh_expiration) missingFields.push("dh_expiration");
      if (!address) missingFields.push("address");
      if (!categories) missingFields.push("categories");
      if (!user) missingFields.push("user");

      throw new AppError(`Um ou mais campos não enviados: ${missingFields.join(", ")}`);
    }

    if (typeof address === 'object' && address !== null) {

      const addr: AddressProps = address;

      if (!addr.street || !addr.neighborhood || !addr.number || !addr.city || !addr.contry || !addr.zip_code) {
        const missingFields = [];

        if (!addr.street) missingFields.push("street");
        if (!addr.neighborhood) missingFields.push("neighborhood");
        if (!addr.number) missingFields.push("number");
        if (!addr.contry) missingFields.push("contry");
        if (!addr.city) missingFields.push("city");
        if (!addr.zip_code) missingFields.push("zip_code");

        throw new AppError(`Um ou mais campos do endereço não foram não enviados: ${missingFields.join(", ")}`);
      }

      const addressEvent =
        await addressRepository.createForEvent({
          city: addr.city,
          contry: addr.contry,
          neighborhood: addr.neighborhood,
          number: addr.number,
          street: addr.street,
          zip_code: addr.zip_code,
          lat: addr.lat,
          long: addr.long        
        });

        const event = await eventRepository.create({ name: name, description:description, dh_event:dh_event, dh_expiration:dh_expiration, userOwnerId:user, addressId: addressEvent.id});

        if(event){

          if (categories && Array.isArray(categories)) {
            categories.forEach((el) => {
              eventCategoriesRepository.create({
                category: el,
                event: event.id
              })
            });
          }

        }

        return response.status(201).json(event);
    }

    
  } 

  async findById(request: Request, response: Response) {
    const { id } = request.params;

    const event = await eventRepository.findById(id);

    if (!event) {
      throw new AppError("Evento não encontrado", 404);
    }

    return response.json(event);
  }

  async findAll(request: Request, response: Response) {
    const { id } = request.params;

    const event = await eventRepository.findByUser(id);

    return response.json(event);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, description, dh_event,dh_expiration, categories } = request.body;

    const stored = await eventRepository.findById(id);

    if (!stored) {
      throw new AppError("Evento não encontrado", 404);
    }

    const event = await eventRepository.update(id, {name, description, dh_event,dh_expiration });

    return response.json(event);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const stored = await eventRepository.findById(id);

    if (!stored) {
      throw new AppError("Evento não encontrado", 404);
    }

    const event = await eventRepository.delete(id);

    return response.json(event);
  }
}

export default new EventController();