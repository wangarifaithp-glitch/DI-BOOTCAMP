function getAction(role: string): string {
    switch (role) {
        case 'admin':
            return 'You have full access to the system.';
        case 'editor':
            return 'You can edit content.';
        case 'viewer':
            return 'You can view content.';
        default:
            return 'Role not recognized.';
    }
}

// Example usage
console.log(getAction('admin')); // Output: You have full access to the system.
console.log(getAction('editor')); // Output: You can edit content.
console.log(getAction('viewer')); // Output: You can view content.
console.log(getAction('guest')); // Output: Role not recognized.