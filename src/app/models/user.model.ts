export class User {
    
    constructor(
        public email: string,
        public telefono: string,
        public nombre?: string,
        public uid?: string,
        public type?: string,
        public estado?: string,
        public type_user?: string
    ) {}

}