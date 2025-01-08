//return false if input is null
export function NullCheck(input) {

    return input != null && input.trim() !== '';

}

//return false if email is an invalid format
export function CheckEmail(email) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);

}

//return false if params don't match type and data
export function VarMatch(fVar, sVar) {

    return fVar === sVar;

}

//checks if pass meets requirements
export function PassRequirements(pass) {

const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    return passRegex.test(pass);

}

//confirms that email is NBCC
export function CheckNBCCEmail(email) {

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(mynbcc\.ca|nbcc\.ca)$/;

    return emailRegex.test(email);

}

