const validator = require('validator');





const validate = (data) => {
    const { firstname, emailId, password } = data;

    const mandatoryFields = ['firstname', 'emailId', 'password'];
    const isAllowed = mandatoryFields.every((field) => Boolean(data[field]));

    if (!isAllowed) {
        throw new Error("Missing mandatory fields: firstname, emailId, and password are required");
    }

    if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email format");
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error("Weak password! Must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol.");
    }

    if (!validator.isLength(firstname, { min: 3, max: 20 })) {
        throw new Error("Firstname must be between 3 and 20 characters long");
    }
};

module.exports=validate;