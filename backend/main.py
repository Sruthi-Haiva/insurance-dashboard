from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
import time
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

# ── Token store (in-memory) ───────────────────────────────────────────────────
token_store = {
    "access_token": os.getenv("ZOHO_ACCESS_TOKEN", ""),
    "expires_at": 0,  # unix timestamp; 0 → force refresh on first request
}

ZOHO_CLIENT_ID     = os.getenv("ZOHO_CLIENT_ID")
ZOHO_CLIENT_SECRET = os.getenv("ZOHO_CLIENT_SECRET")
ZOHO_REFRESH_TOKEN = os.getenv("ZOHO_REFRESH_TOKEN")
ZOHO_SHEET_ID      = os.getenv("ZOHO_SHEET_ID")

ZOHO_TOKEN_URL = "https://accounts.zoho.in/oauth/v2/token"


# ── Helpers ───────────────────────────────────────────────────────────────────

async def refresh_access_token() -> str:
    """Exchange the refresh token for a new access token."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            ZOHO_TOKEN_URL,
            params={
                "grant_type":    "refresh_token",
                "client_id":     ZOHO_CLIENT_ID,
                "client_secret": ZOHO_CLIENT_SECRET,
                "refresh_token": ZOHO_REFRESH_TOKEN,
            },
        )

    data = response.json()

    if "access_token" not in data:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to refresh token: {data}",
        )

    # Zoho tokens live for 3600 s; subtract 60 s as a safety buffer
    expires_in = data.get("expires_in", 3600)
    token_store["access_token"] = data["access_token"]
    token_store["expires_at"]   = time.time() + expires_in - 60

    return token_store["access_token"]


async def get_valid_token() -> str:
    """Return a valid access token, refreshing if necessary."""
    if time.time() >= token_store["expires_at"]:
        return await refresh_access_token()
    return token_store["access_token"]


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/api/records")
async def get_records(worksheet_name: str = "Sheet1"):
    access_token = await get_valid_token()

    url = (
        f"https://sheet.zoho.in/api/v2/{ZOHO_SHEET_ID}"
        f"?method=worksheet.records.fetch&worksheet_name={worksheet_name}"
    )
    headers = {"Authorization": f"Zoho-oauthtoken {access_token}"}

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)

    # If Zoho returns 401 the token may have just expired — retry once
    if response.status_code == 401:
        access_token = await refresh_access_token()
        headers["Authorization"] = f"Zoho-oauthtoken {access_token}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"Zoho API error: {response.text}",
        )

    return response.json()


@app.get("/health")
async def health():
    return {"status": "ok", "token_expires_in": max(0, int(token_store["expires_at"] - time.time()))}