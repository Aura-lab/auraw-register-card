import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { describe, expect, test } from 'vitest';


describe("Register Card Form", () => {
    test("renders header and welcome text", () => {
        render(<App />);
        expect(screen.getByText(/Register card form/i)).toBeInTheDocument();
        expect(screen.getByText(/Welcome Aura/i)).toBeInTheDocument();
    });

    test("submit button is disabled initially", () => {
        render(<App />);
        const btn = screen.getByRole("button", { name: /submit/i });
        expect(btn).toBeDisabled();
    });

    test("shows error messages for invalid inputs", () => {
        render(<App />);

        const cardInput = screen.getByLabelText(/Credit Card Number/i);
        fireEvent.blur(cardInput);
        expect(screen.getByText(/Enter 13–19 digits/i)).toBeInTheDocument();

        const cvcInput = screen.getByLabelText(/CVC/i);
        fireEvent.change(cvcInput, { target: { value: "12" } });
        fireEvent.blur(cvcInput);
        expect(screen.getByText(/Enter 3–4 digits/i)).toBeInTheDocument();

        const expiryInput = screen.getByLabelText(/Expiry/i);
        fireEvent.change(expiryInput, { target: { value: "13/21" } });
        fireEvent.blur(expiryInput);
        expect(screen.getByText(/Use MM\/YY or MM\/YYYY/i)).toBeInTheDocument();
    });

    test("enables submit button when inputs are valid", () => {
        render(<App />);

        fireEvent.change(screen.getByLabelText(/Credit Card Number/i), {
            target: { value: "4111111111111111" }, // 16 digits
        });
        fireEvent.change(screen.getByLabelText(/CVC/i), {
            target: { value: "123" },
        });
        fireEvent.change(screen.getByLabelText(/Expiry/i), {
            target: { value: "12/29" },
        });

        const btn = screen.getByRole("button", { name: /submit/i });
        expect(btn).not.toBeDisabled();
    });
});
