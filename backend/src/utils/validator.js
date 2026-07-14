const validator = require('validator');





const validate = (data)=>{
    const mandatoryField = {firstname,emailId,password} = data;
    
    const IsAllowed= mandatoryField.every((k) => Object.keys(data).includes(k));

    if(!IsAllowed){
        throw new Error("Missing mandatory fields");
    }

    if(!validator.isEmail(emailId)){
        throw new Error("Invalid email format");
    }

    if(!validator.isLength(password,{min:6})){
        throw new Error("Password must be at least 6 characters long");
    }

    if(!validator.isStrongPassword(data.password)){
        throw new Error("Weak password");
    }

    if(!validator.isLength(data.firstname,{min:3,max:20})){
        throw new Error("Firstname must be between 3 and 20 characters long");
    }
}

module.exports=validate;