export class Recogida {
    
    constructor(
        public uid?: string, 
        public cover?: string, 
        public short_name?: string, 
        public nombre?: string,
        public sectores?: string[],
        public rating?: number, //
        public tiempo_entrega?: number, 
        public precio?: number,
        public isClose?: boolean,
        public descripcion?: string,
        public hora_recogida?: string,
        public hora_entrega?: string,
        public comuna?: string,
        public address?: string,
        public estado?: string,
        public totalRating?: number,
        public coordenadas?: any,
        public g?: any,
        public distancia?: number,
    ) {}

}