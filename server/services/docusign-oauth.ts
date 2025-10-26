/**
 * DOCUSIGN OAUTH 2.0 SERVICE
 * 
 * Implements OAuth Authorization Code Grant flow for DocuSign
 * (Alternative to JWT which has SDK bugs)
 * 
 * FLOW:
 * 1. User clicks "Connect DocuSign"
 * 2. Redirect to DocuSign authorization page
 * 3. User logs in and grants permissions
 * 4. DocuSign redirects back with code
 * 5. Exchange code for access_token + refresh_token
 * 6. Store tokens in database
 * 7. Use access_token for API calls
 * 
 * CREDENTIALS REQUIRED:
 * - DOCUSIGN_INTEGRATION_KEY (OAuth Client ID)
 * - DOCUSIGN_SECRET_KEY (OAuth Client Secret)
 * - DOCUSIGN_REDIRECT_URI (Callback URL)
 */

import { db } from '../db.js';
import { oauthTokens } from '@shared/schema.js';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';

// CSRF Protection: In-memory store for state nonces (expires after 10 minutes)
const stateStore = new Map<string, { timestamp: number }>();
const STATE_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes

// Cleanup expired states every minute
setInterval(() => {
  const now = Date.now();
  for (const [state, data] of stateStore.entries()) {
    if (now - data.timestamp > STATE_EXPIRATION_MS) {
      stateStore.delete(state);
    }
  }
}, 60 * 1000);

// Configuration
const DOCUSIGN_ENV = process.env.DOCUSIGN_ENV || 'sandbox';
const DOCUSIGN_AUTH_SERVER = DOCUSIGN_ENV === 'production'
  ? 'https://account.docusign.com'
  : 'https://account-d.docusign.com';

const DOCUSIGN_API_BASE = DOCUSIGN_ENV === 'production'
  ? 'https://www.docusign.net/restapi'
  : 'https://demo.docusign.net/restapi';

export interface OAuthConfig {
  integrationKey: string;
  secretKey: string;
  redirectUri: string;
}

function getOAuthConfig(): OAuthConfig {
  const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
  const secretKey = process.env.DOCUSIGN_SECRET_KEY;
  const redirectUri = process.env.DOCUSIGN_REDIRECT_URI;

  if (!integrationKey || !secretKey || !redirectUri) {
    throw new Error('DocuSign OAuth credentials not configured. Set DOCUSIGN_INTEGRATION_KEY, DOCUSIGN_SECRET_KEY, DOCUSIGN_REDIRECT_URI');
  }

  return { integrationKey, secretKey, redirectUri };
}

/**
 * STEP 1: GENERATE AUTHORIZATION URL
 * 
 * Generates URL to redirect user to DocuSign login page
 * Includes CSRF protection via state parameter
 */
export function getAuthorizationUrl(): { authUrl: string; state: string } {
  const config = getOAuthConfig();
  
  // Generate cryptographically secure random state for CSRF protection
  const state = randomBytes(32).toString('hex');
  
  // Store state with timestamp for validation (expires in 10 minutes)
  stateStore.set(state, { timestamp: Date.now() });
  
  const params = new URLSearchParams({
    response_type: 'code',
    scope: 'signature impersonation',
    client_id: config.integrationKey,
    redirect_uri: config.redirectUri,
    state: state, // CSRF protection
  });

  const authUrl = `${DOCUSIGN_AUTH_SERVER}/oauth/auth?${params.toString()}`;
  
  console.log('📋 DocuSign OAuth Authorization URL generated');
  console.log(`   Environment: ${DOCUSIGN_ENV}`);
  console.log(`   Redirect URI: ${config.redirectUri}`);
  console.log(`   State (CSRF token): ${state.substring(0, 16)}...`);
  
  return { authUrl, state };
}

/**
 * STEP 2: EXCHANGE CODE FOR ACCESS TOKEN
 * 
 * After user authorizes, DocuSign redirects with a code
 * Exchange this code for access_token + refresh_token
 */
export async function exchangeCodeForToken(code: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}> {
  const config = getOAuthConfig();
  
  console.log('🔄 Exchanging authorization code for access token...');
  
  // Basic authentication (client_id:client_secret)
  const credentials = Buffer.from(`${config.integrationKey}:${config.secretKey}`).toString('base64');
  
  const response = await fetch(`${DOCUSIGN_AUTH_SERVER}/oauth/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: config.redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Token exchange failed:', error);
    throw new Error(`Failed to exchange code for token: ${error}`);
  }

  const data = await response.json();
  
  console.log('✅ Access token received');
  console.log(`   Expires in: ${data.expires_in} seconds`);
  
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    tokenType: data.token_type,
  };
}

/**
 * STEP 3: GET USER INFO
 * 
 * Fetch user's account information (needed for API calls)
 */
export async function getUserInfo(accessToken: string): Promise<{
  accountId: string;
  userId: string;
  baseUri: string;
  accountName: string;
}> {
  console.log('📋 Fetching DocuSign user info...');
  
  const response = await fetch(`${DOCUSIGN_AUTH_SERVER}/oauth/userinfo`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Failed to fetch user info:', error);
    throw new Error(`Failed to get user info: ${error}`);
  }

  const data = await response.json();
  
  // Get default account
  const account = data.accounts.find((acc: any) => acc.is_default) || data.accounts[0];
  
  console.log('✅ User info received');
  console.log(`   Account: ${account.account_name} (${account.account_id})`);
  console.log(`   Base URI: ${account.base_uri}`);
  
  return {
    accountId: account.account_id,
    userId: data.sub,
    baseUri: account.base_uri + '/restapi',
    accountName: account.account_name,
  };
}

/**
 * STEP 4: STORE TOKEN IN DATABASE
 * 
 * Saves access_token and refresh_token for future use
 */
export async function storeToken(
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
  accountId: string,
  userId: string,
  baseUri: string
): Promise<void> {
  console.log('💾 Storing DocuSign OAuth token in database...');
  
  const expiresAt = new Date(Date.now() + expiresIn * 1000);
  
  // Delete old tokens for DocuSign
  await db.delete(oauthTokens).where(eq(oauthTokens.provider, 'docusign'));
  
  // Insert new token
  await db.insert(oauthTokens).values({
    provider: 'docusign',
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresAt,
    scope: 'signature impersonation',
    accountId,
    userId,
    baseUri,
  });
  
  console.log('✅ Token stored successfully');
  console.log(`   Expires at: ${expiresAt.toISOString()}`);
}

/**
 * GET VALID ACCESS TOKEN
 * 
 * Returns a valid access token, refreshing if expired
 */
export async function getValidAccessToken(): Promise<{
  accessToken: string;
  accountId: string;
  baseUri: string;
} | null> {
  // Fetch token from database
  const tokens = await db
    .select()
    .from(oauthTokens)
    .where(eq(oauthTokens.provider, 'docusign'))
    .limit(1);

  if (tokens.length === 0) {
    console.log('⚠️  No DocuSign OAuth token found in database');
    return null;
  }

  const token = tokens[0];
  const now = new Date();

  // Check if token is still valid (with 5 min buffer)
  const expiresWithBuffer = new Date(token.expiresAt.getTime() - 5 * 60 * 1000);
  
  if (now < expiresWithBuffer) {
    console.log('✅ Using existing access token');
    return {
      accessToken: token.accessToken,
      accountId: token.accountId!,
      baseUri: token.baseUri!,
    };
  }

  // Token expired, need to refresh
  console.log('🔄 Access token expired, refreshing...');
  
  if (!token.refreshToken) {
    console.log('❌ No refresh token available');
    return null;
  }

  try {
    const newToken = await refreshAccessToken(token.refreshToken);
    
    // Update token in database
    await db
      .update(oauthTokens)
      .set({
        accessToken: newToken.accessToken,
        expiresAt: new Date(Date.now() + newToken.expiresIn * 1000),
        updatedAt: new Date(),
      })
      .where(eq(oauthTokens.id, token.id));

    console.log('✅ Token refreshed successfully');
    
    return {
      accessToken: newToken.accessToken,
      accountId: token.accountId!,
      baseUri: token.baseUri!,
    };
  } catch (error: any) {
    console.error('❌ Failed to refresh token:', error.message);
    return null;
  }
}

/**
 * REFRESH ACCESS TOKEN
 * 
 * Uses refresh_token to get a new access_token
 */
async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  expiresIn: number;
}> {
  const config = getOAuthConfig();
  
  const credentials = Buffer.from(`${config.integrationKey}:${config.secretKey}`).toString('base64');
  
  const response = await fetch(`${DOCUSIGN_AUTH_SERVER}/oauth/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  const data = await response.json();
  
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  };
}

/**
 * VALIDATE STATE (CSRF Protection)
 * 
 * Verifies that the state parameter matches one we generated
 */
export function validateState(state: string): boolean {
  const stateData = stateStore.get(state);
  
  if (!stateData) {
    console.log('⚠️  Invalid state: not found in store');
    return false;
  }
  
  // Check if expired
  const now = Date.now();
  if (now - stateData.timestamp > STATE_EXPIRATION_MS) {
    console.log('⚠️  Invalid state: expired');
    stateStore.delete(state);
    return false;
  }
  
  // Valid state - remove it (one-time use)
  stateStore.delete(state);
  console.log('✅ State validated successfully');
  return true;
}

/**
 * COMPLETE OAUTH FLOW (called from callback route)
 * 
 * Orchestrates the entire OAuth flow after receiving the code
 * VALIDATES state parameter for CSRF protection
 */
export async function completeOAuthFlow(code: string, state: string): Promise<{
  success: boolean;
  accountId: string;
  accountName: string;
}> {
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║   DOCUSIGN OAUTH FLOW (Code Grant)   ║');
  console.log('╚═══════════════════════════════════════╝\n');
  
  // STEP 0: Validate state parameter (CSRF protection)
  if (!validateState(state)) {
    throw new Error('Invalid or expired state parameter - possible CSRF attack');
  }
  
  // Step 1: Exchange code for tokens
  const tokenData = await exchangeCodeForToken(code);
  
  // Step 2: Get user/account info
  const userInfo = await getUserInfo(tokenData.accessToken);
  
  // Step 3: Store tokens in database
  await storeToken(
    tokenData.accessToken,
    tokenData.refreshToken,
    tokenData.expiresIn,
    userInfo.accountId,
    userInfo.userId,
    userInfo.baseUri
  );
  
  console.log('\n✅ OAuth flow completed successfully!\n');
  
  return {
    success: true,
    accountId: userInfo.accountId,
    accountName: userInfo.accountName,
  };
}

/**
 * CHECK IF CONNECTED
 * 
 * Returns true if DocuSign is connected and has valid token
 */
export async function isConnected(): Promise<boolean> {
  const token = await getValidAccessToken();
  return token !== null;
}

/**
 * DISCONNECT
 * 
 * Removes DocuSign OAuth token from database
 */
export async function disconnect(): Promise<void> {
  await db.delete(oauthTokens).where(eq(oauthTokens.provider, 'docusign'));
  console.log('✅ DocuSign disconnected');
}
