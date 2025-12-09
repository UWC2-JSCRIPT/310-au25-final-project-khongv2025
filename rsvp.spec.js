// ----------------------
// Class Tests
// ----------------------
describe("RSVP Class", function () {

  it("creates an RSVP object with correct properties", function () {
    const r = new RSVP("John", "Doe", "john@example.com", "123-456-7890");

    expect(r.firstName).toBe("John");
    expect(r.lastName).toBe("Doe");
    expect(r.email).toBe("john@example.com");
    expect(r.phone).toBe("123-456-7890");
    expect(typeof r.timestamp).toBe("number");
  });

  it("returns full name correctly", function () {
    const r = new RSVP("Jane", "Doe", "jane@example.com", "123-456-7890");
    expect(r.getFullName()).toBe("Jane Doe");
  });
});

// ----------------------
// Validation Tests
// ----------------------
describe("Validation Functions", function () {

  it("validates first name", function () {
    expect(validateFirstName("John")).toBe("");
    expect(validateFirstName("")).toBe("First name must be at least 1 character.");
  });

  it("validates last name", function () {
    expect(validateLastName("Doe")).toBe("");
    expect(validateLastName("")).toBe("Last name must be at least 1 character.");
  });

  it("validates email", function () {
    expect(validateEmail("test@example.com")).toBe("");
    expect(validateEmail("bademail")).toBe("Email must be valid.");
  });

  it("validates phone", function () {
    expect(validatePhone("123-456-7890")).toBe("");
    expect(validatePhone("1234567890")).toBe("Phone must be in format 123-456-7890.");
  });
});

// ----------------------
// Local Storage tests
// ----------------------
describe("Local Storage Interaction", function () {

  beforeEach(function () {
    // mock localStorage
    spyOn(localStorage, "setItem");
    spyOn(localStorage, "getItem").and.returnValue(null);
  });

  it("saves RSVP list to localStorage", function () {
    const r = new RSVP("John", "Doe", "john@example.com", "123-456-7890");
    const list = [r];

    localStorage.setItem("rsvp_list", JSON.stringify(list));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "rsvp_list",
      JSON.stringify(list)
    );
  });
});