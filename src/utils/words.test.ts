import { Word, wordMatchFunction } from "./words";

test("Ignore brackets", () => {
    const recieved = wordMatchFunction(
        new Word("", "Test test (ignore this)"),
        "Test test"
    )

    expect(recieved).toBeTruthy()
})

test("Ignore order", () => {
    const recieved = wordMatchFunction(
        new Word("", "Test test 1 / Test test 2"),
        "Test test 2 / Test test 1"
    )

    expect(recieved).toBeTruthy()
})

test("Ignore order large amount and commas and slashes used", () => {
    const recieved = wordMatchFunction(
        new Word("", "a, b / c, d"),
        "b / a / d/c"
    )

    expect(recieved).toBeTruthy()
})

test("Too many definitions in input", () => {
    const recieved = wordMatchFunction(
        new Word("", "a, b"),
        "a, b, c"
    )

    expect(recieved).toBeFalsy()
})

test("All of it at the same time", () => {
    const recieved = wordMatchFunction(
        new Word("", "1 , 2, 4(deze negeren)/5 ..."),
        "1 / 4 / 2 / 5"
    )

    expect(recieved).toBeTruthy()
})

test("Incorrect user input", () => {
    const recieved = wordMatchFunction(
        new Word("", "ich"),
        "du"
    )

    expect(recieved).toBeFalsy()
})
