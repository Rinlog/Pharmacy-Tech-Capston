//remove special chars from email strings
export function SanitizeEmail(email) {

    const regex = /[^a-zA-Z0-9._%+-@]/g;

    return email.replace(regex, '');

}

//remove special chars from a name
export function SanitizeName(name) {

    const regex = /[^a-zA-Z\s\-',.]/g;

    return name.replace(regex, '');

}

//remove special chars from a date (requires dates to be delimited by hyphens)
export function SanitizeDate(date) {

    const regex = /[^\d-]/g;

    return date.replace(regex, '');

}

// Generic function to sanitize input
export function SanitizeInput(input) {
    // Remove control characters
    input = input.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  
    // Escape HTML entities
    input = input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  
    // Escape SQL special characters
    input = input.replace(/'/g, "''").replace(/--/g, '- -');
  
    return input;
  };

export function SanitizeLength(input, length) {
// We don't need to sanitize the input itself here, we can just cut it off at the desired length
return input.substring(0, length);
}
