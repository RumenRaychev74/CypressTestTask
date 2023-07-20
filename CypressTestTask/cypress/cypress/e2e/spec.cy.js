import promisify from "cypress-promise";

describe("ageVerification", () => {
  it("should pass through age verification with a valid date", async () => {
    // Visit the website that requires age verification
    cy.visit("https://www.redtiger.com/");

    // Enter a valid date in the verification form
    cy.get("#day-3").type("26");

    // Enter a valid month in the verification form
    cy.get("#month-3").type("04");

    // Enter a valid year in the verification form
    cy.get("#year-3").type("2004");

    // Click on the enter button
    cy.get("#email-form > a").first().click();

    // Assert that the user is redirected to the main website
    cy.url().should("not.include", "/html/body/div[1]/div/div/p");

    // Click on the enter cookies button
    cy.get(
      "body > div.cookies-popup.show > div > a.danger-btn.small-btn.cookie-btn.w-button"
    ).click();

    // Click the spin button until 3 equal elements are shown
    let counter = 0;
    let succeeded = false;
    while (counter < 100) {
      let result = await promisify(
        cy
          .get(".spin-btn")
          .click({ force: true })
          .wait(2000)
          .then(() => {
            cy.get(".slot-column a:first-child .text-span-8").then(
              ($elements) => {
                const firstElement = $elements[0].textContent;
                const secondElement = $elements[1].textContent;
                const thirdElement = $elements[2].textContent;

                if (
                  firstElement == "office" &&
                  firstElement === secondElement &&
                  secondElement === thirdElement
                ) {
                  return true;
                } else {
                  return false;
                }
              }
            );
          })
      );

      if (result) {
        succeeded = true;
        break;
      }
      counter++;
    }

    if (!succeeded) {
      // Fail
      cy.should(false);
    }
  });
});
