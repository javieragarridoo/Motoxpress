import { Address } from "../models/address.model";
import { Entrega } from "../models/entrega.model";
import { Recogida } from "../models/recogida.model";

export interface Cart {
    recogida: Recogida;
    entregas: Entrega[];
    totalEntrega?: number;
    totalPrice?: number;
    grandTotal?: number;
    location?: Address;
    deliveryCharge?: number;
    from?: string;
}