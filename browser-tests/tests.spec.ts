import { test, expect } from "@playwright/test"

const set = [
    { term: 'Wat is je lievelingshuisdier?', definition: 'Was ist dein lieblingstier?' },
    { term: 'Mijn lievelingsdier is ...', definition: 'Mein lieblingstier ist ...' },
    { term: 'Heb je een huisdier?', definition: 'Hast du ein Haustier?' },
    { term: 'Ja, ik heb ...', definition: 'Ja, ich habe ...' },
    { term: 'Nee, maar ik wil graag ...', definition: 'Nein, aber ich wünsche mir ...' },
    { term: 'Kun je ... beschrijven?', definition: 'Kannst du ... beschreiben?'},
    { term: 'Mijn ... is ...', definition: 'Mein ... ist ...' },
    { term: 'Het dier heeft ...', definition: 'Das tier hat ...' },
    { term: 'Eet het dier ... of ...?', definition: 'Frisst das tier ... oder ...?'},
    { term: 'Wat eet het?', definition: 'Was frisst es?' },
    { term: '... eet alleen maar...', definition: '... frisst nur ...' },
    { term: '... eet nooit ...', definition: '... frisst nie ...' },
    { term: '... eet het liefst ...', definition: '... frisst am liebsten ...'}
]

test("Study flow", async ({ page }) => {
    await page.goto("http://localhost:3000/study/62a9db93e9de1dd3386472bb")
    await page.waitForLoadState("networkidle")

    // Automatically accept "Everything learned!" dialog
    page.on('dialog', dialog => {
        console.log("Got dialog")
        dialog.accept();
    });

    while (await page.locator("#progress-indicator > b").textContent() != "100") {
        const promptedTerm = await page.locator("#prompt").textContent();
        const answer = set.find(word => word.term === promptedTerm)?.definition

        expect(answer).toBeTruthy()

        const mpcContainer = await page.locator(".mpc-container").isVisible({timeout: 500})

        // 20% Chance for wrong anser
        const doCorrectAnswer = Math.random() < 0.8;

        if (mpcContainer) {
            // Multiple choice
            if (doCorrectAnswer) {
                const correctButton = page.locator("text=" + answer)

                // Click correct button
                await correctButton.click()
            } else {
                // Choose a wrong option
                const options = await page.locator(".mpc-container > div > button").allTextContents()
                const filtered_opts = options.filter(option => option !== answer)
                const wrongAnswer = filtered_opts[0]
                await page.locator("text=" + wrongAnswer).click()
            }
        } else {
            // Non multiple choice
            const answerToFill = doCorrectAnswer ? answer : "" 
            await page.fill("text=Definition", (answerToFill as string))
            await page.keyboard.press("Enter")
        }

        await page.locator(".feedback-text").waitFor({timeout: 1000})
        await page.keyboard.press("Space")
    }
})