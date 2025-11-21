import argparse
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes
import datetime

"""
Based on https://cryptography.io/en/latest/x509/tutorial/#creating-a-self-signed-certificate
"""


def generate_self_signed_certificate(
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
    subject = issuer = x509.Name(subject_name_attributes)

    builder = (
        x509.CertificateBuilder()
        .subject_name(subject)
        .issuer_name(issuer)
        .public_key(key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(datetime.datetime.now(datetime.timezone.utc))
        .not_valid_after(
            datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=365)
        )
    )

    if subject_alternative_names:
        print("subject_alternative_names", subject_alternative_names)
        builder.add_extension(
            x509.SubjectAlternativeName(
                [x509.DNSName(san) for san in subject_alternative_names]
            ),
            critical=False,
        )
    cert = builder.sign(key, hashes.SHA256())
    return cert


def write_files(key: rsa.RSAPrivateKey, cert: x509.Certificate):
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

    certificate_filename = "certificate.pem"
    with open(certificate_filename, "wb") as f:
        f.write(cert.public_bytes(serialization.Encoding.PEM))
    print(f"Wrote certificate to {certificate_filename}")


def main():
    parser = argparse.ArgumentParser(
        description="Generate a self-signed certificate and private key.",
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
    cert = generate_self_signed_certificate(
        key,
        args.country,
        args.state,
        args.locality,
        args.organization,
        args.organizational_unit,
        args.common_name,
        args.subject_alternative_names,
    )
    write_files(key, cert)

    print("Done")


if __name__ == "__main__":
    main()
