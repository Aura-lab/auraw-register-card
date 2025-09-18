import React, { useMemo, useReducer, useState } from "react";
import "./App.css";

const user = { firstName: "Aura", lastName: "Wang" };

type FormState = {
    cardNumber: string;
    cvc: string;
    expiry: string;
    touched: Record<string, boolean>;
};

type Action =
    | { type: "SET"; field: keyof Omit<FormState, "touched">; value: string }
    | { type: "TOUCH"; field: keyof FormState }
    | { type: "RESET" };

const initialState: FormState = { cardNumber: "", cvc: "", expiry: "", touched: {} };

function reducer(state: FormState, action: Action): FormState {
    switch (action.type) {
        case "SET":
            return { ...state, [action.field]: action.value } as FormState;
        case "TOUCH":
            return { ...state, touched: { ...state.touched, [action.field]: true } };
        case "RESET":
            return initialState;
        default:
            return state;
    }
}

const onlyDigits = (s: string) => s.replace(/\D+/g, "");
function isValidCardNumber(v: string) { return /^\d{13,19}$/.test(v); }
function isValidCvc(v: string) { return /^\d{3,4}$/.test(v); }

type ExpiryValidation = { valid: true } | { valid: false; reason: "format" | "expired" };
function checkExpiry(raw: string): ExpiryValidation {
    const v = raw.trim();
    const m = v.match(/^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/);
    if (!m) return { valid: false, reason: "format" };

    const month = Number(m[1]);
    let year = Number(m[2]);
    if (year < 100) year += 2000;

    const d = new Date(year, month - 1, 1);
    if (d.getMonth() !== month - 1 || d.getFullYear() !== year) return { valid: false, reason: "format" };

    const now = new Date();
    const ymNow = now.getFullYear() * 100 + (now.getMonth() + 1);
    const ymExp = year * 100 + month;
    return ymExp < ymNow ? { valid: false, reason: "expired" } : { valid: true };
}

function Field(props: {
    id: string; label: string; value: string;
    placeholder?: string; onChange: (v: string) => void;
    onBlur?: () => void; error?: string | null;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; maxLength?: number;
}) {
    const { id, label, value, placeholder, onChange, onBlur, error, inputMode, maxLength } = props;
    return (
        <div className="field">
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                name={id}
                className="input"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                inputMode={inputMode}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                maxLength={maxLength}
            />
            {error && <p id={`${id}-error`} className="error">{error}</p>}
        </div>
    );
}

export default function App() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [menuOpen, setMenuOpen] = useState(false);

    const errors = useMemo(() => {
        const e: Record<string, string | null> = {};
        e.cardNumber = state.touched.cardNumber && !isValidCardNumber(state.cardNumber) ? "Enter 13–19 digits" : null;
        e.cvc = state.touched.cvc && !isValidCvc(state.cvc) ? "Enter 3–4 digits" : null;
        if (state.touched.expiry) {
            const res = checkExpiry(state.expiry);
            e.expiry = res.valid ? null : res.reason === "format" ? "Use MM/YY or MM/YYYY" : "Card is expired";
        } else e.expiry = null;
        return e;
    }, [state]);

    const isFormValid =
        isValidCardNumber(state.cardNumber) &&
        isValidCvc(state.cvc) &&
        checkExpiry(state.expiry).valid;

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        if (!isFormValid) return;
        console.log({ cardNumber: state.cardNumber, cvc: state.cvc, expiry: state.expiry });
        dispatch({ type: "RESET" });
    }

    return (
        <>
            <header>
                <button className="burger-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
                    <span className="burger-line" />
                    <span className="burger-line" />
                    <span className="burger-line" />
                </button>
                <h1 className="h1">Register card form</h1>
                <div className="header-spacer" />
            </header>

            {menuOpen && (
                <div className="menu-overlay" role="dialog" aria-modal="true" aria-label="Menu">
                    <div className="menu">
                        <div className="menu-header">
                            <button className="back-btn" aria-label="Back to register card form" onClick={() => setMenuOpen(false)}>←</button>
                            <div className="menu-title">Menu</div>
                            <div className="menu-header-spacer" />
                        </div>
                        <div className="menu-body">
                            <p>This is menu content</p>
                            <nav className="menu-nav">
                                <a className="menu-nav__link">Home</a>
                                <a className="menu-nav__link">About</a>
                                <a className="menu-nav__link">Contact</a>
                            </nav>
                        </div>
                    </div>
                    <button className="overlay-close" aria-label="Close overlay" onClick={() => setMenuOpen(false)} />
                </div>
            )}

            <main className="container">
                <section className="card" aria-labelledby="form-title">
                    <div className="card-title">Welcome {user.firstName}</div>

                    <form onSubmit={handleSubmit}>
                        <Field
                            id="cardNumber" label="Credit Card Number" placeholder="13–19 digits"
                            value={state.cardNumber}
                            onChange={(v) => dispatch({ type: "SET", field: "cardNumber", value: onlyDigits(v) })}
                            onBlur={() => dispatch({ type: "TOUCH", field: "cardNumber" })}
                            error={errors.cardNumber ?? undefined}
                            inputMode="numeric" maxLength={19}
                        />

                        <div className="row">
                            <Field
                                id="cvc" label="CVC" placeholder="3–4 digits"
                                value={state.cvc}
                                onChange={(v) => dispatch({ type: "SET", field: "cvc", value: onlyDigits(v) })}
                                onBlur={() => dispatch({ type: "TOUCH", field: "cvc" })}
                                error={errors.cvc ?? undefined}
                                inputMode="numeric" maxLength={4}
                            />
                            <Field
                                id="expiry" label="Expiry" placeholder="MM/YY or MM/YYYY"
                                value={state.expiry}
                                onChange={(v) => dispatch({ type: "SET", field: "expiry", value: v })}
                                onBlur={() => dispatch({ type: "TOUCH", field: "expiry" })}
                                error={errors.expiry ?? undefined}
                                inputMode="numeric" maxLength={7}
                            />
                        </div>

                        <button type="submit" className="btn" disabled={!isFormValid}>Submit</button>
                    </form>

                    <p className="note">Submit button is disabled when inputs are invalid, values are printed to the console when submitted.</p>
                </section>
            </main>
        </>
    );
}
