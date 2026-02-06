import { Client } from "pg";

async function testConnection(connectionString) {
  const client = new Client({ connectionString });
  try {
    console.log(`Testing: ${connectionString.replace(/:[^:@]*@/, ":****@")}`);
    await client.connect();
    console.log("SUCCESS: Connected!");
    await client.end();
    return true;
  } catch (err) {
    console.log(`FAILED: ${err.message}`);
    try {
      await client.end();
    } catch {
      // Ignore errors when closing connection
    }
    return false;
  }
}

async function main() {
  // Option 1: New credentials (postgres)
  await testConnection(
    "postgresql://postgres:Aditya_DB@localhost:5432/collabledger_db"
  );

  // Option 2: Old credentials (user)
  await testConnection(
    "postgresql://user:password@localhost:5432/collabledger"
  );

  // Option 3: Default postgres local?
  await testConnection(
    "postgresql://postgres:postgres@localhost:5432/postgres"
  );
}

main();
