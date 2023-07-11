import { Address } from "./address.model";
import { Entrega } from "./entrega.model";
import { Recogida } from "./recogida.model";

export class Order {
    constructor(
        public address: Address,
        public recogida: Recogida,
        public recogida_id: string,
        public order: Entrega[],
        public total: number,
        public grandTotal: number,
        public deliveryCharge: number,
        public estado: string,
        public hora: string,
        public paid: string,
        public id?: string,
        public uid?: string,
        public instrucciones?: string,
        public usuarioId?: string,
        public rider?: string,
        public coordenadas_entrega?: string
    ) {}
}