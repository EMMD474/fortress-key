import { randomBytes } from 'crypto';

const generatePassword = (length: number = 8): string => {
    if (length < 8) {
        throw new Error("Password length must be at least 4 to satisfy all rules.");
    }

    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specials = '!@#$%^&*()_+[]{}|;:,.<>?';

    // Start by guaranteeing one character from each category
    let password = '';
    password += upper[randomBytes(1)[0] % upper.length];
    password += lower[randomBytes(1)[0] % lower.length];
    password += numbers[randomBytes(1)[0] % numbers.length];
    password += specials[randomBytes(1)[0] % specials.length];

    // Combine all chars for the remaining length
    const allChars = upper + lower + numbers + specials;
    const remainingLength = length - 4;
    const randomBuffer = randomBytes(remainingLength);

    for (let i = 0; i < remainingLength; i++) {
        password += allChars[randomBuffer[i] % allChars.length];
    }

    // Shuffle the password so guaranteed chars are not always at the start
    password = password
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('');

    return password;
}

export default generatePassword