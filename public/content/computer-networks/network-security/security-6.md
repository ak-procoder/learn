---
id: security-6
title: Cryptography and Encryption Methods
type: text
---

## Introduction to Cryptography

Cryptography is the science of protecting information by transforming it into an unreadable format for unauthorized users while allowing authorized users to access the original data. It forms the foundation of modern network security, enabling secure communication, authentication, and data integrity.

### Historical Context
- **Ancient Cryptography**: Caesar cipher, substitution methods
- **Mechanical Era**: Enigma machine, rotor-based encryption
- **Computer Age**: DES, RSA, and modern algorithms
- **Quantum Era**: Post-quantum cryptography preparation

### Core Cryptographic Objectives
- **Confidentiality**: Ensuring information remains secret
- **Integrity**: Detecting unauthorized modifications
- **Authentication**: Verifying identity of communicating parties
- **Non-repudiation**: Preventing denial of actions or communications

## Fundamental Cryptographic Concepts

### Encryption and Decryption
The process of converting readable data (plaintext) into unreadable format (ciphertext) and back.

#### Basic Terminology
- **Plaintext**: Original, readable message or data
- **Ciphertext**: Encrypted, unreadable version of plaintext
- **Key**: Secret parameter used in encryption/decryption algorithms
- **Algorithm**: Mathematical procedure for encryption/decryption
- **Keyspace**: Total number of possible keys for an algorithm

### Cryptographic Strength
Factors that determine the security level of cryptographic systems.

#### Key Length and Security
- **56-bit keys**: Easily broken by modern computers
- **128-bit keys**: Considered secure for most applications
- **256-bit keys**: Provides long-term security assurance
- **Key length doubling**: Each additional bit doubles the keyspace

#### Algorithm Security
- **Mathematical complexity**: Difficulty of breaking without the key
- **Proven algorithms**: Extensively tested and analyzed
- **Implementation security**: Proper coding and side-channel protection
- **Quantum resistance**: Ability to withstand quantum computer attacks

## Symmetric Encryption

### Symmetric Key Cryptography
Uses the same key for both encryption and decryption operations.

#### Advantages of Symmetric Encryption
- **High Performance**: Fast encryption and decryption
- **Low Computational Overhead**: Suitable for large data volumes
- **Mature Algorithms**: Well-established and tested methods
- **Hardware Optimization**: Efficient hardware implementations available

#### Disadvantages of Symmetric Encryption
- **Key Distribution Problem**: Secure key sharing challenges
- **Key Management Complexity**: Managing many keys for multiple parties
- **No Authentication**: Doesn't inherently provide sender authentication
- **Scalability Issues**: Key requirements grow quadratically with users

### Block Ciphers
Encrypt fixed-size blocks of data using the same key and algorithm.

#### Advanced Encryption Standard (AES)
The current standard for symmetric encryption adopted by the US government.

**AES Characteristics:**
- **Block Size**: 128 bits
- **Key Sizes**: 128, 192, or 256 bits
- **Rounds**: 10, 12, or 14 rounds depending on key size
- **Security**: No practical attacks against properly implemented AES

**AES Implementation:**
```
Key Sizes and Security Levels:
- AES-128: 10 rounds, suitable for most commercial applications
- AES-192: 12 rounds, higher security for sensitive applications
- AES-256: 14 rounds, maximum security for top-secret information

Performance Considerations:
- Hardware acceleration available on modern processors
- Software implementations achieve hundreds of MB/s
- Low memory requirements suitable for embedded systems
```

#### Data Encryption Standard (DES) and 3DES
Legacy symmetric encryption algorithms with historical significance.

**DES Limitations:**
- **Key Length**: 56-bit keys, easily broken by brute force
- **Block Size**: 64-bit blocks, vulnerable to birthday attacks
- **Deprecated Status**: No longer considered secure for new implementations

**Triple DES (3DES):**
- **Three DES Operations**: Encrypt-Decrypt-Encrypt with different keys
- **Effective Key Length**: 112 or 168 bits depending on key arrangement
- **Legacy Support**: Still used in some financial and payment systems
- **Performance Impact**: Three times slower than single DES

### Stream Ciphers
Encrypt data one bit or byte at a time using a continuous key stream.

#### ChaCha20
Modern stream cipher designed for high performance and security.

**ChaCha20 Features:**
- **Key Size**: 256-bit keys
- **Nonce**: 96-bit random number for each encryption
- **Performance**: Excellent performance on software platforms
- **Security**: Resistant to timing attacks and side-channel analysis

#### RC4 (Rivest Cipher 4)
Legacy stream cipher with known vulnerabilities.

**RC4 Issues:**
- **Biased Output**: Statistical weaknesses in the key stream
- **Key Schedule Flaws**: Weak key generation process
- **Deprecated Status**: No longer recommended for new implementations

### Modes of Operation
Methods for using block ciphers to encrypt data larger than the block size.

#### Electronic Codebook (ECB)
Simplest mode where each block is encrypted independently.

**ECB Characteristics:**
- **Deterministic**: Same plaintext blocks produce same ciphertext
- **Pattern Preservation**: Can reveal patterns in encrypted data
- **Parallel Processing**: Encryption and decryption can be parallelized
- **Security Weakness**: Not recommended for most applications

#### Cipher Block Chaining (CBC)
Each plaintext block is XORed with the previous ciphertext block before encryption.

**CBC Features:**
- **Initialization Vector (IV)**: Random value for the first block
- **Chaining Effect**: Identical plaintext blocks produce different ciphertext
- **Error Propagation**: Single bit error affects current and next blocks
- **Sequential Processing**: Cannot parallelize encryption

#### Counter (CTR) Mode
Converts block cipher into stream cipher using counter values.

**CTR Advantages:**
- **Parallel Processing**: Can encrypt/decrypt blocks independently
- **Random Access**: Can decrypt any block without processing others
- **No Padding Required**: Handles arbitrary message lengths
- **Error Containment**: Single bit errors don't propagate

#### Galois/Counter Mode (GCM)
Authenticated encryption mode providing both confidentiality and integrity.

**GCM Benefits:**
- **Authenticated Encryption**: Combines encryption with authentication
- **High Performance**: Efficient hardware and software implementations
- **Parallel Processing**: Supports parallel encryption and authentication
- **Standardization**: Widely adopted in modern protocols (TLS 1.3)

## Asymmetric Encryption

### Public Key Cryptography
Uses pairs of mathematically related keys: public and private keys.

#### Key Pair Properties
- **Public Key**: Can be shared openly without compromising security
- **Private Key**: Must be kept secret by the owner
- **Mathematical Relationship**: Keys are related but computationally infeasible to derive one from the other
- **Asymmetric Operations**: What's encrypted with one key can only be decrypted with the other

#### Applications of Asymmetric Encryption
- **Key Exchange**: Securely establishing symmetric keys
- **Digital Signatures**: Providing authentication and non-repudiation
- **Digital Certificates**: Binding public keys to identities
- **Secure Communication**: Enabling secure communication without prior key sharing

### RSA (Rivest-Shamir-Adleman)
Most widely used public key algorithm based on factoring large integers.

#### RSA Algorithm Basics
**Key Generation:**
1. Choose two large prime numbers (p and q)
2. Compute n = p × q (modulus)
3. Compute φ(n) = (p-1)(q-1) (Euler's totient function)
4. Choose public exponent e (commonly 65537)
5. Calculate private exponent d = e⁻¹ mod φ(n)

**Encryption and Decryption:**
- **Encryption**: C = M^e mod n
- **Decryption**: M = C^d mod n
- **Digital Signature**: S = M^d mod n
- **Signature Verification**: M = S^e mod n

#### RSA Security Considerations
- **Key Length**: 2048-bit minimum, 3072-bit recommended for new systems
- **Factoring Problem**: Security based on difficulty of factoring large integers
- **Quantum Vulnerability**: Vulnerable to Shor's algorithm on quantum computers
- **Padding Schemes**: Requires proper padding (OAEP) to prevent attacks

### Elliptic Curve Cryptography (ECC)
Public key cryptography based on elliptic curve mathematics.

#### ECC Advantages
- **Smaller Key Sizes**: 256-bit ECC provides security equivalent to 3072-bit RSA
- **Better Performance**: Faster computations and lower power consumption
- **Scalability**: More efficient for mobile and IoT devices
- **Future-Ready**: Better positioned for post-quantum transitions

#### Popular Elliptic Curves
- **P-256 (secp256r1)**: NIST standard curve, widely supported
- **P-384 (secp384r1)**: Higher security level for sensitive applications
- **Curve25519**: Modern curve designed for performance and security
- **Ed25519**: Edwards curve variant optimized for digital signatures

### Diffie-Hellman Key Exchange
Method for securely establishing shared keys over insecure channels.

#### Classical Diffie-Hellman
**Process:**
1. Alice and Bob agree on public parameters (p, g)
2. Alice generates private key a, computes A = g^a mod p
3. Bob generates private key b, computes B = g^b mod p
4. Alice and Bob exchange A and B
5. Both compute shared secret: s = B^a mod p = A^b mod p

#### Elliptic Curve Diffie-Hellman (ECDH)
**Advantages over classical DH:**
- Smaller key sizes with equivalent security
- Better performance characteristics
- Lower bandwidth requirements for key exchange
- Resistance to many classical attacks

## Hash Functions and Digital Signatures

### Cryptographic Hash Functions
One-way functions that produce fixed-size output from arbitrary input.

#### Hash Function Properties
- **Deterministic**: Same input always produces same output
- **Fixed Output Size**: Hash value has constant length regardless of input size
- **Avalanche Effect**: Small input changes cause large output changes
- **Pre-image Resistance**: Computationally infeasible to find input from hash
- **Collision Resistance**: Hard to find two inputs producing same hash

#### Secure Hash Algorithm Family

**SHA-1 (Deprecated):**
- **Output Size**: 160 bits
- **Security Status**: Cryptographically broken, collisions found
- **Legacy Use**: Still seen in older systems, should be replaced

**SHA-2 Family:**
- **SHA-224**: 224-bit output, moderate security
- **SHA-256**: 256-bit output, widely used standard
- **SHA-384**: 384-bit output, higher security applications
- **SHA-512**: 512-bit output, maximum security

**SHA-3 (Keccak):**
- **Different Design**: Sponge construction instead of Merkle-Damgård
- **Security Margin**: Large security margin against known attacks
- **Standardization**: NIST standard since 2015
- **Performance**: Competitive with SHA-2 on modern hardware

### Digital Signatures
Cryptographic mechanism providing authentication, integrity, and non-repudiation.

#### Digital Signature Process
**Signing:**
1. Generate hash of the message
2. Encrypt hash with signer's private key
3. Attach signature to message

**Verification:**
1. Generate hash of received message
2. Decrypt signature using signer's public key
3. Compare decrypted hash with computed hash

#### RSA Signatures
- **PKCS#1 v1.5**: Legacy padding scheme with known vulnerabilities
- **PSS (Probabilistic Signature Scheme)**: Modern, secure padding
- **Performance**: Verification faster than signing
- **Key Usage**: Same keys can be used for encryption and signing (not recommended)

#### ECDSA (Elliptic Curve Digital Signature Algorithm)
- **Smaller Signatures**: More compact than RSA signatures
- **Better Performance**: Faster signing and verification
- **Randomness Critical**: Requires high-quality random number generation
- **Standard Curves**: Use well-vetted curves like P-256 or Ed25519

## Key Management and Distribution

### Key Lifecycle Management
Comprehensive management of cryptographic keys throughout their operational life.

#### Key Generation
- **Random Number Generation**: High-quality entropy sources required
- **Hardware Security Modules (HSMs)**: Dedicated devices for secure key generation
- **Key Strength**: Appropriate key lengths for security requirements
- **Algorithm Selection**: Choosing appropriate algorithms for use cases

#### Key Distribution
- **Out-of-Band Methods**: Physical delivery or secure channels
- **Key Exchange Protocols**: Cryptographic methods for secure key sharing
- **Certificate Authorities**: Trusted third parties for public key distribution
- **Key Servers**: Centralized repositories for public keys

#### Key Storage and Protection
- **Hardware Security Modules**: Tamper-resistant hardware for key storage
- **Software Keystores**: Encrypted storage in software applications
- **Key Escrow**: Controlled access to keys for legitimate recovery
- **Access Controls**: Authentication and authorization for key access

#### Key Rotation and Revocation
- **Regular Rotation**: Periodic replacement of cryptographic keys
- **Compromise Response**: Immediate revocation of potentially compromised keys
- **Certificate Revocation Lists (CRLs)**: Lists of revoked certificates
- **Online Certificate Status Protocol (OCSP)**: Real-time certificate validation

### Public Key Infrastructure (PKI)
Framework for managing digital certificates and public-private key pairs.

#### PKI Components
- **Certificate Authority (CA)**: Issues and manages digital certificates
- **Registration Authority (RA)**: Verifies certificate requests
- **Certificate Repository**: Stores and distributes certificates
- **Certificate Revocation Infrastructure**: Manages revoked certificates

#### Digital Certificates
- **X.509 Standard**: Most common certificate format
- **Certificate Fields**: Subject, issuer, validity period, public key
- **Certificate Chain**: Hierarchy of trust from root CA to end entity
- **Trust Models**: Different approaches to establishing trust relationships

## Modern Cryptographic Protocols

### Transport Layer Security (TLS)
Protocol providing secure communication over networks.

#### TLS Handshake Process
1. **Client Hello**: Supported cipher suites and extensions
2. **Server Hello**: Selected cipher suite and certificate
3. **Key Exchange**: Establish shared encryption keys
4. **Authentication**: Verify server (and optionally client) identity
5. **Application Data**: Encrypted communication begins

#### TLS Evolution
- **TLS 1.0/1.1**: Legacy versions with known vulnerabilities
- **TLS 1.2**: Current widely-deployed version with good security
- **TLS 1.3**: Latest version with improved security and performance
- **Cipher Suite Selection**: Algorithm combinations for different security levels

### Perfect Forward Secrecy (PFS)
Property ensuring past communications remain secure even if long-term keys are compromised.

#### PFS Implementation
- **Ephemeral Key Exchange**: Temporary keys for each session
- **ECDHE**: Elliptic Curve Diffie-Hellman Ephemeral
- **DHE**: Diffie-Hellman Ephemeral (less efficient than ECDHE)
- **Key Deletion**: Secure destruction of temporary keys after use

## Future of Cryptography

### Post-Quantum Cryptography
Preparing for the threat of quantum computers to current cryptographic systems.

#### Quantum Computing Threats
- **Shor's Algorithm**: Efficiently factors large integers and computes discrete logarithms
- **Grover's Algorithm**: Provides quadratic speedup for searching unsorted databases
- **Timeline Uncertainty**: Unknown when large-scale quantum computers will be available
- **Crypto-Agility**: Importance of designing systems that can easily upgrade algorithms

#### Post-Quantum Algorithms
- **Lattice-Based**: Security based on problems in high-dimensional lattices
- **Code-Based**: Security based on error-correcting codes
- **Multivariate**: Security based on solving multivariate polynomial equations
- **Hash-Based Signatures**: Signatures based on hash function security

### Emerging Cryptographic Techniques
- **Homomorphic Encryption**: Computation on encrypted data without decryption
- **Zero-Knowledge Proofs**: Proving knowledge without revealing the information
- **Secure Multi-Party Computation**: Collaborative computation without revealing inputs
- **Blockchain Cryptography**: Distributed ledger security mechanisms