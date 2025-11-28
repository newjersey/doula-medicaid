import argparse
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes
import datetime

"""
Based on https://cryptography.io/en/latest/x509/tutorial/#creating-a-certificate-signing-request-csr
"""


def generate_certificate_signing_request(
    key: rsa.RSAPrivateKey,
    country_name: str,
    state_or_province_name: str,
    locality_name: str,
    organization_name: str,
    organizational_unit: str,
    common_name: str | None,
    subject_alternative_names: list[str] | None,
):
    subject_name_attributes = [
        x509.NameAttribute(NameOID.COUNTRY_NAME, country_name),
        x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, state_or_province_name),
        x509.NameAttribute(NameOID.LOCALITY_NAME, locality_name),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, organization_name),
        x509.NameAttribute(NameOID.ORGANIZATIONAL_UNIT_NAME, organizational_unit),
    ]
    if common_name:
        subject_name_attributes.append(
            x509.NameAttribute(NameOID.COMMON_NAME, common_name)
        )

    builder = x509.CertificateSigningRequestBuilder().subject_name(
        x509.Name(subject_name_attributes)
    )

    if subject_alternative_names:
        builder = builder.add_extension(
            x509.SubjectAlternativeName(
                [x509.DNSName(san) for san in subject_alternative_names]
            ),
            critical=False,
        )
    csr = builder.sign(key, hashes.SHA256())
    return csr


def write_files(key: rsa.RSAPrivateKey, csr: x509.CertificateSigningRequest):
    private_key_filename = "private_key.pem"
    with open(private_key_filename, "wb") as f:
        f.write(
            key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption(),
            )
        )
    print(f"Wrote private key to {private_key_filename}")

    csr_filename = "csr.pem"
    with open(csr_filename, "wb") as f:
        f.write(csr.public_bytes(serialization.Encoding.PEM))
    print(f"Wrote csr to {csr_filename}")


def main():
    parser = argparse.ArgumentParser(
        description="Generate a certificate signing request and private key.",
    )
    parser.add_argument("--country", required=True, help="Country Name (2 letter code)")
    parser.add_argument(
        "--state", required=True, help="State or Province Name (full name)"
    )
    parser.add_argument("--locality", required=True, help="Locality Name (e.g., city)")
    parser.add_argument(
        "--organization", required=True, help="Organization Name (e.g., company)"
    )
    parser.add_argument(
        "--organizational_unit",
        required=True,
        help="Organizational Unit Name (e.g., section)",
    )
    parser.add_argument(
        "--common_name",
        help="Common Name (e.g., server FQDN or YOUR name; can be left blank)",
    )
    parser.add_argument(
        "--subject_alternative_names",
        nargs="*",
        help="Subject Alternative Names (SANs) - space-separated list",
    )

    args = parser.parse_args()

    if not (args.san or args.common_name):
        raise ValueError("common name or SAN is required")

    key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
    )
    csr = generate_certificate_signing_request(
        key,
        args.country,
        args.state,
        args.locality,
        args.organization,
        args.organizational_unit,
        args.common_name,
        args.subject_alternative_names,
    )
    write_files(key, csr)
    print("Done")


if __name__ == "__main__":
    main()
