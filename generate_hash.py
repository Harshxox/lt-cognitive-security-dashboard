import bcrypt

# The PIN you want to use
admin_pin = "LT-SECURE-2026"

# Generate the salt and the hash
salt = bcrypt.gensalt()
hashed_pin = bcrypt.hashpw(admin_pin.encode('utf-8'), salt)

print("\n✅ HASH GENERATED SUCCESSFULLY!")
print("Replace the MASTER_ADMIN_PIN line in your .env file with this exact line:\n")
print(f"ADMIN_PIN_HASH={hashed_pin.decode('utf-8')}\n")