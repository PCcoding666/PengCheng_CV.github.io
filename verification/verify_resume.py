from playwright.sync_api import sync_playwright

def verify_resume(page):
    page.goto("http://localhost:3000")

    # Wait for the main heading
    page.wait_for_selector("h1:has-text('PENG CHENG')")

    # Take full page screenshot
    page.screenshot(path="verification/resume.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_resume(page)
        finally:
            browser.close()
