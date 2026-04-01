import { describe, it, expect } from "vitest";
import { EMAIL_REGEX, validateLoginForm, validateRegisterForm } from "./validation";

describe("EMAIL_REGEX", () => {
  it("accepts valid email formats", () => {
    expect(EMAIL_REGEX.test("user@example.com")).toBe(true);
    expect(EMAIL_REGEX.test("name@domain.co")).toBe(true);
    expect(EMAIL_REGEX.test("a.b@c.d.e")).toBe(true);
  });

  it("rejects invalid email formats", () => {
    expect(EMAIL_REGEX.test("")).toBe(false);
    expect(EMAIL_REGEX.test("invalid")).toBe(false);
    expect(EMAIL_REGEX.test("@domain.com")).toBe(false);
    expect(EMAIL_REGEX.test("user@")).toBe(false);
    expect(EMAIL_REGEX.test("user @test.com")).toBe(false);
  });
});

describe("validateLoginForm", () => {
  it("returns no errors for valid data", () => {
    const result = validateLoginForm({ email: "user@example.com", password: "123456" });
    expect(Object.keys(result)).toHaveLength(0);
  });

  it("returns error when email is empty", () => {
    const result = validateLoginForm({ email: "", password: "123456" });
    expect(result.email).toBeDefined();
  });

  it("returns error when email is only whitespace", () => {
    const result = validateLoginForm({ email: "   ", password: "123456" });
    expect(result.email).toBeDefined();
  });

  it("returns error when email format is invalid", () => {
    const result = validateLoginForm({ email: "not-an-email", password: "123456" });
    expect(result.email).toBeDefined();
  });

  it("returns error when password is empty", () => {
    const result = validateLoginForm({ email: "user@example.com", password: "" });
    expect(result.password).toBeDefined();
  });

  it("returns multiple errors when both fields are invalid", () => {
    const result = validateLoginForm({ email: "", password: "" });
    expect(result.email).toBeDefined();
    expect(result.password).toBeDefined();
  });
});

describe("validateRegisterForm", () => {
  const validForm = {
    name: "John Doe",
    email: "john@example.com",
    password: "123456",
    confirmPassword: "123456",
  };

  it("returns no errors for valid data", () => {
    const result = validateRegisterForm(validForm);
    expect(Object.keys(result)).toHaveLength(0);
  });

  it("returns error when name is empty", () => {
    const result = validateRegisterForm({ ...validForm, name: "" });
    expect(result.name).toBeDefined();
  });

  it("returns error when name is only whitespace", () => {
    const result = validateRegisterForm({ ...validForm, name: "   " });
    expect(result.name).toBeDefined();
  });

  it("returns error when email is invalid", () => {
    const result = validateRegisterForm({ ...validForm, email: "bad" });
    expect(result.email).toBeDefined();
  });

  it("returns error when password is shorter than 6 characters", () => {
    const result = validateRegisterForm({ ...validForm, password: "123", confirmPassword: "123" });
    expect(result.password).toBeDefined();
  });

  it("returns error when confirmPassword is empty", () => {
    const result = validateRegisterForm({ ...validForm, confirmPassword: "" });
    expect(result.confirmPassword).toBeDefined();
  });

  it("returns error when passwords do not match", () => {
    const result = validateRegisterForm({ ...validForm, confirmPassword: "654321" });
    expect(result.confirmPassword).toBeDefined();
  });

  it("does not return password length error for 6+ character passwords", () => {
    const result = validateRegisterForm({ ...validForm, password: "abcdef", confirmPassword: "abcdef" });
    expect(result.password).toBeUndefined();
  });
});
