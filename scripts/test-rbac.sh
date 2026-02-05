#!/bin/bash

# RBAC Testing Script for CollabLedger
# This script tests Role-Based Access Control

BASE_URL="http://localhost:3000"
echo "🧪 Testing RBAC Implementation for CollabLedger"
echo "================================================"
echo ""

# Test 1: Create Admin User
echo "1️⃣ Creating Admin User..."
ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@collabledger.com",
    "password": "admin123456",
    "name": "Admin User",
    "role": "ADMIN"
  }')

echo "Response: $ADMIN_RESPONSE"
ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo ""

# Test 2: Create Regular User
echo "2️⃣ Creating Regular User..."
USER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@collabledger.com",
    "password": "user123456",
    "name": "Regular User",
    "role": "USER"
  }')

echo "Response: $USER_RESPONSE"
echo ""

# Test 3: Login as Admin
echo "3️⃣ Login as Admin..."
ADMIN_LOGIN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@collabledger.com",
    "password": "admin123456"
  }' -c admin_cookies.txt)

echo "Response: $ADMIN_LOGIN"
echo ""

# Test 4: Login as Regular User
echo "4️⃣ Login as Regular User..."
USER_LOGIN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@collabledger.com",
    "password": "user123456"
  }' -c user_cookies.txt)

echo "Response: $USER_LOGIN"
echo ""

# Test 5: Admin Access to /api/admin (Should Succeed)
echo "5️⃣ Testing Admin Access to /api/admin (Should Succeed ✅)..."
ADMIN_ACCESS=$(curl -s -X GET "$BASE_URL/api/admin" \
  -b admin_cookies.txt)

echo "Response: $ADMIN_ACCESS"
echo ""

# Test 6: User Access to /api/admin (Should Fail ❌)
echo "6️⃣ Testing Regular User Access to /api/admin (Should Fail ❌)..."
USER_ACCESS_ADMIN=$(curl -s -X GET "$BASE_URL/api/admin" \
  -b user_cookies.txt)

echo "Response: $USER_ACCESS_ADMIN"
echo ""

# Test 7: User Access to /api/users (Should Succeed ✅)
echo "7️⃣ Testing Regular User Access to /api/users (Should Succeed ✅)..."
USER_ACCESS_USERS=$(curl -s -X GET "$BASE_URL/api/users" \
  -b user_cookies.txt)

echo "Response: $USER_ACCESS_USERS"
echo ""

# Test 8: Unauthenticated Access (Should Fail ❌)
echo "8️⃣ Testing Unauthenticated Access to /api/users (Should Fail ❌)..."
UNAUTH_ACCESS=$(curl -s -X GET "$BASE_URL/api/users")

echo "Response: $UNAUTH_ACCESS"
echo ""

# Cleanup
rm -f admin_cookies.txt user_cookies.txt

echo "✅ RBAC Testing Complete!"
echo ""
echo "📊 Expected Results:"
echo "  ✅ Admin can access /api/admin"
echo "  ❌ Regular user CANNOT access /api/admin"
echo "  ✅ Authenticated users can access /api/users"
echo "  ❌ Unauthenticated users CANNOT access /api/users"
