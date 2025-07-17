# Bitcoin Paper Wallet Transaction Creator

## Overview

This is a Bitcoin paper wallet transaction creator tool designed to help users create Bitcoin transactions from paper wallets. The application appears to be a client-side web application with a focus on security and offline capability, as indicated by the online/offline status indicators in the interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology**: Pure HTML/CSS/JavaScript (client-side only)
- **Design Pattern**: Single-page application (SPA)
- **UI Framework**: Vanilla JavaScript with custom CSS styling
- **Security Model**: Client-side only processing to maintain privacy and security

### Backend Architecture
- **Current State**: No backend implementation
- **Intended Design**: Fully client-side application to avoid server-side security risks
- **Data Processing**: All Bitcoin transaction creation handled in the browser

## Key Components

### User Interface Components
1. **Status Indicator System**
   - Online/Offline status display
   - Visual feedback with color-coded states (red for online, green for offline)
   - Emphasizes security-conscious design

2. **Transaction Creator Interface** (To be implemented)
   - Paper wallet import functionality
   - Transaction input/output configuration
   - Private key handling
   - Transaction signing and broadcasting

### Security Components
1. **Offline Operation Mode**
   - Designed to work without internet connection for enhanced security
   - Status indicator to show current connectivity state

2. **Client-Side Processing**
   - All cryptographic operations performed in browser
   - No server-side data transmission

## Data Flow

### Current Implementation
- Basic HTML structure with styling
- Status indicator for network connectivity

### Intended Data Flow
1. User imports paper wallet private key
2. Application queries blockchain for UTXO data
3. User configures transaction parameters
4. Transaction is created and signed locally
5. Signed transaction can be broadcast to network

## External Dependencies

### Current Dependencies
- **bitcoinjs-lib@6.1.5**: Complete Bitcoin library for transaction creation and signing
- **qrcode@1.5.3**: QR code generation library for transaction display
- **buffer**: Buffer polyfill for browser compatibility
- **browserify**: Used to bundle Node.js libraries for browser use

### Implementation Status
- Bitcoin library locally bundled and integrated
- QR code library locally bundled and integrated
- All cryptographic operations handled by bitcoinjs-lib
- Libraries loaded from local files (not CDN) for offline security

## Deployment Strategy

### Current Approach
- Static HTML file deployment
- Can be served from any web server or opened locally

### Recommended Deployment
- **Static Site Hosting**: GitHub Pages, Netlify, or similar
- **Local Usage**: Can be downloaded and run offline for security
- **HTTPS Required**: For security when accessing blockchain APIs
- **Offline Capability**: Core functionality should work without internet

## Development Notes

### Security Considerations
- All private key operations must remain client-side
- Offline mode is crucial for security
- Clear visual indicators for network status

### Implementation Status
- **Current**: Basic HTML structure and styling
- **Needed**: Bitcoin library integration, transaction creation logic, blockchain API integration

### Technical Debt
- Incomplete HTML structure
- Missing JavaScript functionality
- No Bitcoin transaction handling implemented

## Future Enhancements

1. **Core Bitcoin Functionality**
   - Transaction creation and signing
   - Multi-signature support
   - Fee calculation

2. **User Experience**
   - QR code generation for transactions
   - Paper wallet scanning
   - Transaction history

3. **Security Features**
   - Air-gapped operation mode
   - Secure key generation
   - Transaction verification tools