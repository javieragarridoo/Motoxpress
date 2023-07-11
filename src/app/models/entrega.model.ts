export class Entrega {
    
    constructor(
        public id: string,
        public uid: string,
        public category_id: any,
        public cover: string,
        public nombre: string,
        public desc: string,
        public precio: number,
        public estado: boolean,
        public variation: boolean,
        public rating: number,
        public cantidad?: number
    ) {}

}