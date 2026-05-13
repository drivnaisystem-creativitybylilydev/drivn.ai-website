#!/usr/bin/env python3
"""
German Business Lead Scraper
Phase 1: python lead-scraper.py --city "Berlin" --industry "Restaurant" --limit 50
Phase 2: python lead-scraper.py --enrich leads_de/berlin-restaurant-2026-05-13.csv
"""

import argparse
import csv
import json
import os
import re
import sys
import time
import random
import requests
from datetime import datetime
from pathlib import Path
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

APIFY_KEY  = os.environ.get("APIFY_API_KEY", "")
APIFY_BASE = "https://api.apify.com/v2"
LEADS_DIR  = Path(__file__).parent.parent / "leads_de"
LEADS_DIR.mkdir(exist_ok=True)

MAPS_ACTOR = "compass~crawler-google-places"

COLUMNS = [
    "business_name", "category", "city", "phone", "email",
    "website_url", "website_score", "website_issues",
    "google_rating", "review_count",
    "instagram_url", "instagram_followers",
    "tiktok_url", "tiktok_followers",
    "owner_name", "google_maps_link",
    "lead_score", "status", "notes", "date_added",
]

USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
]


# ---------------------------------------------------------------------------
# Apify helpers
# ---------------------------------------------------------------------------

def apify_run(actor_id: str, payload: dict, timeout: int = 300) -> list:
    if not APIFY_KEY:
        print("[ERROR] APIFY_API_KEY not set. Check your .env file.")
        sys.exit(1)

    resp = requests.post(
        f"{APIFY_BASE}/acts/{actor_id}/runs",
        params={"token": APIFY_KEY},
        json=payload,
        timeout=30,
    )
    resp.raise_for_status()
    run_id = resp.json()["data"]["id"]
    print(f"  Apify run started: {run_id}")

    deadline = time.time() + timeout
    while time.time() < deadline:
        time.sleep(6)
        status_resp = requests.get(
            f"{APIFY_BASE}/actor-runs/{run_id}",
            params={"token": APIFY_KEY},
            timeout=15,
        )
        status = status_resp.json()["data"]["status"]
        if status == "SUCCEEDED":
            break
        if status in ("FAILED", "ABORTED", "TIMED-OUT"):
            raise RuntimeError(f"Apify actor {status}")
        print(f"  Status: {status}...")

    items = requests.get(
        f"{APIFY_BASE}/actor-runs/{run_id}/dataset/items",
        params={"token": APIFY_KEY, "limit": 500},
        timeout=30,
    ).json()

    return items if isinstance(items, list) else []


# ---------------------------------------------------------------------------
# Phase 1 — Google Maps scrape
# ---------------------------------------------------------------------------

def analyze_website(url: str) -> tuple[int, str]:
    """Score website quality 1-10. 10 = no website."""
    if not url or not url.strip():
        return 10, "No website"

    issues = []
    score = 9

    try:
        resp = requests.get(
            url, timeout=8,
            headers={"User-Agent": random.choice(USER_AGENTS)},
            allow_redirects=True,
        )
        if resp.status_code >= 400:
            return 9, "Website broken/unreachable"

        soup = BeautifulSoup(resp.text, "html.parser")
        elapsed = resp.elapsed.total_seconds()

        if not soup.find("meta", attrs={"name": "viewport"}):
            issues.append("Not mobile-friendly")
            score -= 2

        if elapsed > 5:
            issues.append("Very slow loading")
            score -= 2
        elif elapsed > 3:
            issues.append("Slow loading")
            score -= 1

        if resp.text.lower().count("<font") > 3:
            issues.append("Outdated HTML")
            score -= 1

        if soup.find("table", {"width": True}):
            issues.append("Table-based layout")
            score -= 1

        text = soup.get_text().lower()
        if any(t in text for t in ["under construction", "coming soon", "im aufbau", "demnächst"]):
            issues.append("Under construction")
            score -= 2

        if len(text.strip()) < 300:
            issues.append("Thin content")
            score -= 1

    except requests.exceptions.ConnectionError:
        return 9, "Website unreachable"
    except requests.exceptions.Timeout:
        return 8, "Website timeout"
    except Exception as e:
        return 7, f"Analysis error: {str(e)[:40]}"

    return max(1, score), (", ".join(issues) if issues else "Functional but improvable")


def scrape_maps(city: str, industry: str, limit: int, no_website_only: bool = False, extra_names: list = None) -> list[dict]:
    print(f"\nPhase 1 — Google Maps: {industry} in {city}  (target: {limit})")
    if no_website_only:
        print("  Filter: NO WEBSITE only (score 10)")
    print("-" * 60)

    search_strings = [f"{industry} in {city}"]
    # Add targeted searches for specific businesses passed in
    if extra_names:
        for name in extra_names:
            search_strings.append(f"{name} {city}")

    payload = {
        "searchStringsArray": search_strings,
        "maxCrawledPlacesPerSearch": limit,
        "language": "de",
        "countryCode": "de",
        "maxImages": 0,
    }

    print("  Calling Apify Google Maps actor...")
    raw = apify_run(MAPS_ACTOR, payload, timeout=300)
    print(f"  Raw results: {len(raw)} places")

    # Deduplicate by place title
    seen_names: set[str] = set()
    leads = []
    for place in raw:
        title = (place.get("title") or "").strip()
        if title in seen_names:
            continue
        seen_names.add(title)

        rating = place.get("totalScore") or 0
        try:
            rating = float(str(rating).replace(",", "."))
        except Exception:
            rating = 0

        # Filter: 4+ stars (unrated = 0, include those)
        if rating > 0 and rating < 4.0:
            continue

        website = place.get("website") or ""
        website_score, website_issues = analyze_website(website)

        # Filter: no website only OR score 7+
        if no_website_only and website_score < 10:
            continue
        elif not no_website_only and website_score < 7:
            continue

        # Extract email
        emails = place.get("emails") or []
        email = emails[0] if emails else ""

        lead = {
            "business_name": place.get("title", ""),
            "category":      place.get("categoryName", ""),
            "city":          city,
            "phone":         place.get("phone") or place.get("phoneUnformatted") or "",
            "email":         email,
            "website_url":   website,
            "website_score": website_score,
            "website_issues":website_issues,
            "google_rating": rating,
            "review_count":  place.get("reviewsCount") or "",
            "instagram_url": "",
            "instagram_followers": "",
            "tiktok_url":    "",
            "tiktok_followers": "",
            "owner_name":    "",
            "google_maps_link": place.get("url") or place.get("googleMapsUrl") or "",
            "lead_score":    website_score,
            "status":        "New",
            "notes":         "",
            "date_added":    datetime.now().strftime("%Y-%m-%d"),
        }
        leads.append(lead)

        tag = "No website" if website_score == 10 else f"Score {website_score}"
        print(f"  ✓ {lead['business_name']}  {rating}★  {tag}")

    return leads


# ---------------------------------------------------------------------------
# Phase 2 — Social enrichment
# ---------------------------------------------------------------------------

def duckduckgo_search(query: str) -> str:
    """Return raw HTML from a DuckDuckGo search."""
    try:
        resp = requests.get(
            "https://html.duckduckgo.com/html/",
            params={"q": query},
            headers={"User-Agent": random.choice(USER_AGENTS)},
            timeout=10,
        )
        return resp.text
    except Exception:
        return ""


def extract_url_from_search(html: str, domain: str) -> str:
    """Pull first URL matching domain from DDG results."""
    soup = BeautifulSoup(html, "html.parser")
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if domain in href:
            # DuckDuckGo wraps URLs — extract the actual URL
            match = re.search(r"uddg=([^&]+)", href)
            if match:
                from urllib.parse import unquote
                return unquote(match.group(1))
            if href.startswith("http") and domain in href:
                return href
    # Fallback: grep raw HTML for domain URLs
    matches = re.findall(rf'https?://(?:www\.)?{re.escape(domain)}/[^\s"\'<>]+', html)
    return matches[0] if matches else ""


def extract_owner_from_search(html: str) -> str:
    """Try to extract a person's name from search result snippets."""
    soup = BeautifulSoup(html, "html.parser")
    snippets = [el.get_text() for el in soup.find_all(class_=re.compile(r"result__snippet|snippet"))]
    for snippet in snippets:
        # German owner patterns
        for pattern in [
            r"Inhaber[in]?\s*[:\-]?\s*([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)+)",
            r"Geschäftsführer[in]?\s*[:\-]?\s*([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)+)",
            r"gegründet von\s+([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)+)",
        ]:
            m = re.search(pattern, snippet, re.IGNORECASE)
            if m:
                return m.group(1).strip()
    return ""


def enrich_lead(lead: dict) -> dict:
    name = lead["business_name"]
    city = lead["city"]
    print(f"  Enriching: {name}...")

    # Instagram
    ig_html = duckduckgo_search(f'"{name}" "{city}" site:instagram.com')
    ig_url = extract_url_from_search(ig_html, "instagram.com")
    lead["instagram_url"] = ig_url
    time.sleep(random.uniform(1.5, 2.5))

    # TikTok
    tt_html = duckduckgo_search(f'"{name}" "{city}" site:tiktok.com')
    tt_url = extract_url_from_search(tt_html, "tiktok.com")
    lead["tiktok_url"] = tt_url
    time.sleep(random.uniform(1.5, 2.5))

    # Owner name
    owner_html = duckduckgo_search(f'Inhaber "{name}" {city}')
    owner = extract_owner_from_search(owner_html)
    lead["owner_name"] = owner
    time.sleep(random.uniform(1.5, 2.5))

    found = []
    if ig_url:  found.append("Instagram")
    if tt_url:  found.append("TikTok")
    if owner:   found.append(f"Owner: {owner}")
    print(f"    → {', '.join(found) if found else 'nothing found'}")

    return lead


def enrich_csv(csv_path: Path):
    print(f"\nPhase 2 — Enriching: {csv_path.name}")
    print("-" * 60)

    leads = []
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            leads.append(dict(row))

    print(f"  {len(leads)} leads to enrich\n")

    for i, lead in enumerate(leads, 1):
        print(f"  [{i}/{len(leads)}]", end=" ")
        leads[i - 1] = enrich_lead(lead)

    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=COLUMNS, extrasaction="ignore")
        writer.writeheader()
        for lead in leads:
            writer.writerow({k: lead.get(k, "") for k in COLUMNS})

    print(f"\n✅ Enriched CSV saved: {csv_path}")
    ig_count = sum(1 for l in leads if l.get("instagram_url"))
    tt_count = sum(1 for l in leads if l.get("tiktok_url"))
    ow_count = sum(1 for l in leads if l.get("owner_name"))
    print(f"   Instagram found: {ig_count}/{len(leads)}")
    print(f"   TikTok found:    {tt_count}/{len(leads)}")
    print(f"   Owner found:     {ow_count}/{len(leads)}")
    print(f"\nSHEETS_UPLOAD_READY::{csv_path.absolute()}")


# ---------------------------------------------------------------------------
# CSV save
# ---------------------------------------------------------------------------

def save_csv(leads: list[dict], city: str, industry: str) -> Path:
    safe_city = re.sub(r"[^\w]", "-", city.lower())
    safe_ind  = re.sub(r"[^\w]", "-", industry.lower())
    date_str  = datetime.now().strftime("%Y-%m-%d")
    path = LEADS_DIR / f"{safe_city}-{safe_ind}-{date_str}.csv"

    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=COLUMNS)
        writer.writeheader()
        for lead in leads:
            writer.writerow({k: lead.get(k, "") for k in COLUMNS})

    return path


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="German Business Lead Scraper")
    parser.add_argument("--city",            help="City to target (e.g. Berlin)")
    parser.add_argument("--industry",        help="Industry keyword in German (e.g. Restaurant, Dachdecker)")
    parser.add_argument("--limit",           type=int, default=50, help="Max leads (default: 50)")
    parser.add_argument("--no-website-only", action="store_true", help="Only return businesses with zero website")
    parser.add_argument("--enrich",          metavar="CSV_PATH", help="Phase 2: enrich an existing CSV with social data")
    parser.add_argument("--upload-to-sheets",action="store_true", help="Signal Claude to upload CSV to Google Sheets")
    args = parser.parse_args()

    if args.enrich:
        enrich_csv(Path(args.enrich))
        return

    if not args.city or not args.industry:
        parser.error("--city and --industry are required for Phase 1")

    leads = scrape_maps(args.city, args.industry, args.limit, no_website_only=args.no_website_only)

    if not leads:
        print("\n[!] No qualified leads found. Try a different city or industry.")
        sys.exit(0)

    csv_path = save_csv(leads, args.city, args.industry)
    scores = [int(l["website_score"]) for l in leads]

    print(f"\n{'='*60}")
    print(f"✅ {len(leads)} qualified leads")
    print(f"   Score 10 (no website):   {scores.count(10)}")
    print(f"   Score 8-9 (bad website): {sum(1 for s in scores if 8 <= s <= 9)}")
    print(f"   Score 7 (improvable):    {scores.count(7)}")
    print(f"\n📄 CSV saved: {csv_path}")
    print(f"\nNext: review the CSV, then run:")
    print(f"  python agents/lead-scraper.py --enrich {csv_path}")

    if args.upload_to_sheets:
        print(f"\nSHEETS_UPLOAD_READY::{csv_path.absolute()}::{args.city} {args.industry} Leads - {datetime.now().strftime('%Y-%m-%d')}")


if __name__ == "__main__":
    main()
