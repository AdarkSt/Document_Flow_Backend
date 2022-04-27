module.exports = class UserDto{
    email;
    id;
    first_name;
    last_name;
    position;
    role;

    constructor(model) {
        this.email = model.email;
        this.id = model.id
        this.first_name = model.first_name
        this.last_name = model.last_name
        this.position = model.position
        this.role = model.role
    }
}
