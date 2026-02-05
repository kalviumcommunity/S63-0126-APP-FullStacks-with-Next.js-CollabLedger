const BASE = 'http://localhost:3000'

async function signup() {
  const res = await fetch(`${BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Smoke Tester', email: 'smoke-tester+cli@example.com', password: 'P@ssw0rd!' })
  })
  const json = await res.json().catch(() => null)
  console.log('SIGNUP', res.status, JSON.stringify(json))
  return { status: res.status, body: json }
}

async function login() {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'smoke-tester+cli@example.com', password: 'P@ssw0rd!' })
  })
  const json = await res.json().catch(() => null)
  console.log('LOGIN', res.status, JSON.stringify(json))
  return { status: res.status, body: json }
}

async function getUser(token) {
  const res = await fetch(`${BASE}/api/users`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
  const json = await res.json().catch(() => null)
  console.log('USERS', res.status, JSON.stringify(json))
  return { status: res.status, body: json }
}

async function waitForServer(retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      await fetch(BASE)
      return true
    } catch {
      await new Promise(r => setTimeout(r, 1000))
    }
  }
  return false
}

async function run() {
  console.log('Starting smoke tests...')
  const ok = await waitForServer(15)
  if (!ok) {
    console.error('Server did not become available')
    process.exit(1)
  }
  const su = await signup()
  if (su.status >= 400 && su.status !== 409) { process.exit(1) }
  const loginRes = await login()
  const token = loginRes.body?.token
  if (!token) {
    console.error('No token returned; aborting users request')
    process.exit(1)
  }
  await getUser(token)
}

run().catch(err => { console.error(err); process.exit(1) })
