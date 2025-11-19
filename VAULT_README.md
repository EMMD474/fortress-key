# Password Vault - Feature Documentation

## Overview

The Password Vault is a secure credential management system that allows users to store, organize, and manage their passwords and login credentials. The vault includes advanced features like search, filtering, categorization, and secure encryption.

## Features

### 🔐 Core Functionality
- **Secure Storage**: All credentials are encrypted using AES-256-GCM encryption
- **Master Password Protection**: Access controlled by user's master password
- **CRUD Operations**: Create, Read, Update, Delete credentials
- **Real-time Search**: Instant search across credential labels, usernames, and websites
- **Advanced Filtering**: Filter by categories and sort by various criteria

### 🎨 User Interface
- **Dual View Modes**: Grid and List view for different user preferences
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Modern dark UI with blue accent colors
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Toast Notifications**: Real-time feedback for user actions

### 🏷️ Organization
- **Categories**: Organize credentials by type (Email, Banking, Work, etc.)
- **Custom Categories**: Users can create custom categories
- **Smart Sorting**: Sort by name, date created, or category
- **Bulk Operations**: Select and manage multiple credentials

### 🔍 Search & Filter
- **Global Search**: Search across all credential fields
- **Category Filtering**: Filter by specific categories
- **Real-time Results**: Instant filtering as you type
- **Clear Filters**: Easy reset of all filters

### 🛡️ Security Features
- **Password Visibility Toggle**: Show/hide passwords securely
- **Copy Protection**: Secure clipboard operations
- **Session Management**: Automatic logout on inactivity
- **Audit Trail**: Track credential access and modifications

## Database Schema

### Credential Model
```prisma
model Credential {
  id            String    @id @default(uuid())
  label         String    // Display name for the credential
  encryptedData Bytes     // Encrypted JSON containing sensitive data
  iv            Bytes     // Initialization vector for encryption
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @default(now())
  userId        String    // Owner of the credential
  user          User      @relation(fields: [userId], references: [id])
  categoryId    Int?      // Optional category assignment
  category      Category? @relation(fields: [categoryId], references: [id])
}
```

### Category Model
```prisma
model Category {
  id          Int          @id @default(autoincrement())
  name        String       @unique
  isDefault   Boolean      @default(false)
  userId      String?      // null = system-wide default
  user        User?        @relation(fields: [userId], references: [id])
  credentials Credential[] // all credentials under this category
}
```

## API Endpoints

### Credentials API

#### GET /api/credentials
Fetch all credentials for the authenticated user.

**Response:**
```json
{
  "credentials": [
    {
      "id": "uuid",
      "label": "Gmail Account",
      "username": "user@gmail.com",
      "password": "decrypted_password",
      "website": "https://gmail.com",
      "notes": "Personal email account",
      "category": { "id": 1, "name": "Email" },
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  ]
}
```

#### POST /api/credentials
Create a new credential.

**Request Body:**
```json
{
  "label": "Gmail Account",
  "username": "user@gmail.com",
  "password": "secure_password",
  "website": "https://gmail.com",
  "notes": "Personal email account",
  "categoryId": 1,
  "masterPassword": "user_master_password"
}
```

#### GET /api/credentials/[id]
Fetch a specific credential by ID.

#### PUT /api/credentials/[id]
Update an existing credential.

#### DELETE /api/credentials/[id]
Delete a credential.

### Categories API

#### GET /api/category
Fetch all available categories.

#### POST /api/category
Create a new category.

## Encryption Implementation

### Data Encryption
All sensitive credential data is encrypted before storage:

```typescript
interface CredentialData {
  username: string;
  password: string;
  website: string;
  notes: string;
}

// Encryption process:
// 1. Derive key from master password + salt
// 2. Generate random IV
// 3. Encrypt data using AES-256-GCM
// 4. Store encrypted data + IV in database
```

### Security Considerations
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Salt**: Unique salt per user
- **IV**: Random initialization vector per credential
- **Authentication**: GCM mode provides authentication
- **Zero-Knowledge**: Server never sees plaintext passwords

## Component Architecture

### Main Components

#### VaultPage (`/app/(main)/vault/page.tsx`)
- Main vault interface
- Handles state management
- Coordinates API calls
- Manages search and filtering

#### CredentialCard
- Individual credential display
- Supports grid and list modes
- Handles copy operations
- Manages password visibility

#### AddCredentials (`/components/AddCredentials.tsx`)
- Credential creation form
- Password generator integration
- Category selection
- Form validation

### State Management
```typescript
interface VaultState {
  credentials: Credential[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  sortBy: 'name' | 'date' | 'category';
  viewMode: 'grid' | 'list';
  showFilters: boolean;
}
```

## Usage Examples

### Basic Usage
1. **View Credentials**: Navigate to `/vault` to see all stored credentials
2. **Search**: Use the search bar to find specific credentials
3. **Filter**: Click the filter button to access advanced filtering options
4. **Add New**: Click the "+" button to add a new credential
5. **Edit**: Click the edit button on any credential card
6. **Delete**: Click the delete button and confirm deletion

### Advanced Features
- **Bulk Operations**: Select multiple credentials for batch operations
- **Export**: Export credentials in encrypted format
- **Import**: Import credentials from other password managers
- **Sharing**: Securely share credentials with team members

## Security Best Practices

### For Users
1. Use a strong, unique master password
2. Enable two-factor authentication
3. Regularly update stored passwords
4. Review credential access logs
5. Use the password generator for new accounts

### For Developers
1. Never log sensitive data
2. Use secure random number generation
3. Implement proper session management
4. Regular security audits
5. Keep dependencies updated

## Future Enhancements

### Planned Features
- [ ] Credential sharing between users
- [ ] Password strength analysis
- [ ] Breach monitoring integration
- [ ] Mobile app synchronization
- [ ] Biometric authentication
- [ ] Secure notes and documents
- [ ] Team management features
- [ ] Advanced audit logging
- [ ] Backup and recovery tools
- [ ] Browser extension integration

### Performance Optimizations
- [ ] Virtual scrolling for large datasets
- [ ] Lazy loading of credential details
- [ ] Caching strategies
- [ ] Database indexing optimization
- [ ] CDN integration for static assets

## Troubleshooting

### Common Issues

#### Credentials Not Loading
- Check network connectivity
- Verify authentication status
- Clear browser cache
- Check console for errors

#### Search Not Working
- Ensure search term is not empty
- Check for special characters
- Verify filter settings
- Try refreshing the page

#### Encryption Errors
- Verify master password
- Check database connectivity
- Ensure proper key derivation
- Review encryption implementation

### Error Codes
- `401`: Unauthorized - User not authenticated
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Credential doesn't exist
- `500`: Server Error - Internal server issue

## Contributing

When contributing to the vault functionality:

1. Follow the existing code style
2. Add proper TypeScript types
3. Include error handling
4. Write unit tests
5. Update documentation
6. Test security implications
7. Consider performance impact

## License

This vault implementation is part of the Fortress Key password manager and follows the project's main license terms.
