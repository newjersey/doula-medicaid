#!/usr/bin/env python

from cryptography import x509
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from cryptography.x509.oid import NameOID
from datetime import datetime, timedelta, timezone
import argparse
import random

def generate_rsa_private_key(key_size: int = 2048) -> rsa.RSAPrivateKey:
    return rsa.generate_private_key(public_exponent=65537, key_size=key_size)

def generate_self_signed_cert(private_key: rsa.RSAPrivateKey, subject: x509.Name, san_dns_names: list) -> x509.Certificate:
    cert_builder = x509.CertificateBuilder()
    cert_builder = cert_builder.subject_name(subject)
    cert_builder = cert_builder.issuer_name(subject)  # Self-signed, issuer is subject
    cert_builder = cert_builder.not_valid_before(datetime.now(timezone.utc))
    cert_builder = cert_builder.not_valid_after(datetime.now(timezone.utc) + timedelta(days=365))  # 1 year validity
    cert_builder = cert_builder.serial_number(random.randint(1, 2**64))
    cert_builder = cert_builder.public_key(private_key.public_key())

    if san_dns_names:
        san_list = [x509.DNSName(dns_name) for dns_name in san_dns_names]
        cert_builder = cert_builder.add_extension(
            x509.SubjectAlternativeName(san_list), critical=False
        )

    certificate = cert_builder.sign(private_key, hashes.SHA256())
    return certificate

def save_private_key(private_key: rsa.RSAPrivateKey, filename: str) -> None:
    with open(filename, "wb") as key_file:
        key_file.write(
            private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption(),
            )
        )

def save_certificate(certificate: x509.Certificate, filename: str) -> None:
    with open(filename, "wb") as cert_file:
        cert_file.write(certificate.public_bytes(serialization.Encoding.PEM))

def main():
    parser = argparse.ArgumentParser(
        description="Generate a self-signed certificate and private key.",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    parser.add_argument("--country", required=True, help="Country Name (2 letter code)")
    parser.add_argument("--state", required=True, help="State or Province Name (full name)")
    parser.add_argument("--locality", required=True, help="Locality Name (e.g., city)")
    parser.add_argument("--organization", required=True, help="Organization Name (e.g., company)")
    parser.add_argument("--organizational_unit", required=True, help="Organizational Unit Name (e.g., section)")
    parser.add_argument("--common_name", help="Common Name (e.g., server FQDN or YOUR name; can be left blank)")
    parser.add_argument("--email", required=True, help="Email Address")
    parser.add_argument("--san", nargs="*", help="Subject Alternative Names (SANs) - space-separated list")

    args = parser.parse_args()

    if not (args.san or args.common_name):
        raise ValueError("common name or SAN is required")

    # Create the subject for the certificate
    subject_attributes = [
        x509.NameAttribute(NameOID.COUNTRY_NAME, args.country),
        x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, args.state),
        x509.NameAttribute(NameOID.LOCALITY_NAME, args.locality),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, args.organization),
        x509.NameAttribute(NameOID.ORGANIZATIONAL_UNIT_NAME, args.organizational_unit),
        x509.NameAttribute(NameOID.EMAIL_ADDRESS, args.email),
    ]

    if args.common_name:
        subject_attributes.append(x509.NameAttribute(NameOID.COMMON_NAME, args.common_name))

    subject = x509.Name(subject_attributes)

    private_key = generate_rsa_private_key(2048)
    certificate = generate_self_signed_cert(private_key, subject, args.san)

    save_private_key(private_key, "private_key.pem")
    save_certificate(certificate, "certificate.pem")

    print("Done")

if __name__ == "__main__":
    main()